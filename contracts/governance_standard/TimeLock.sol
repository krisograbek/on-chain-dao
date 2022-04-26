// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimeLockController.sol";

contract TimeLock is TimeLockController {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimeLockController(minDelay, proposers, executors) {}
}
