import { network } from "hardhat";
import fs from "fs";
import path from "path";

type DeploymentRecord = {
  contract: string;
  network: string;
  address: string;
  admin: string;
  transactionHash: string;
  blockNumber: number | null;
  deployedAt: string;
};

type DeploymentHistory = {
  deployments: DeploymentRecord[];
};

const { ethers } = await network.connect();

console.log("Deploying Akshayaa...");

const Akshayaa = await ethers.getContractFactory("Akshayaa");

const akshayaa = await Akshayaa.deploy();

await akshayaa.waitForDeployment();

const address = await akshayaa.getAddress();
const admin = await akshayaa.admin();

const deploymentTx = akshayaa.deploymentTransaction();

const transactionHash = deploymentTx?.hash ?? "Unknown";

let blockNumber: number | null = null;

if (deploymentTx) {
  const receipt = await deploymentTx.wait();

  if (receipt) {
    blockNumber = receipt.blockNumber;
  }
}

const deploymentData: DeploymentRecord = {
  contract: "Akshayaa",
  network: "sepolia",
  address: address,
  admin: admin,
  transactionHash: transactionHash,
  blockNumber: blockNumber,
  deployedAt: new Date().toISOString()
};

const filePath = path.join(
  process.cwd(),
  "deployments",
  "deployments.json"
);

fs.mkdirSync(path.dirname(filePath), { recursive: true });

let history: DeploymentHistory = {
  deployments: []
};

if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  if (fileContent.trim()) {
    history = JSON.parse(fileContent) as DeploymentHistory;
  }
}

history.deployments.push(deploymentData);

fs.writeFileSync(
  filePath,
  JSON.stringify(history, null, 2)
);

console.log("--------------------------------");
console.log("Akshayaa deployed successfully!");
console.log("Contract address:", address);
console.log("Admin:", admin);
console.log("Transaction hash:", transactionHash);
console.log("Block number:", blockNumber);
console.log("Deployment history updated!");
console.log("--------------------------------");