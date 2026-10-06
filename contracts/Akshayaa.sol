// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Akshayaa {
    address public admin;
    string public message;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function setMessage(string memory _message) public onlyAdmin {
        message = _message;
    }
}