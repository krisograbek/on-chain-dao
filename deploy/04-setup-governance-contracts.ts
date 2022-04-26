import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { constants } from "ethers";

const setupContracts: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContractAt("TimeLock", deployer);
  const governorContract = await ethers.getContractAt("GovernorContract", deployer);

  log("Setting up roles...");

  // we have to change roles
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/TimelockController.sol
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address);
  await proposerTx.wait(1);
  const executorTx = await timeLock.grantRole(executorRole, constants.AddressZero);
  await executorTx.wait(1);
  const adminTx = await timeLock.revokeRole(adminRole, deployer);
  await adminTx.wait(1);
  // after these transactions, nobody owns the timelock
  // everything has to go through the governance

}

export default setupContracts;
