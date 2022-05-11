import { BigNumber } from "ethers";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// @ts-ignore
import { ethers } from "hardhat";
import { getDelegates, getVotes } from "../deploy/01-deploy-governor-token";


const sendTokens: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { log } = deployments;
  const { deployer, secondAccount, thirdAccount } = await getNamedAccounts();

  // get governance Token Contract
  const governanceToken = await ethers.getContract("GovernanceToken"); // name, address

  await transfer(governanceToken, secondAccount, BigNumber.from("50000000000000000000000")); //50k tokens => 5%
  await transfer(governanceToken, thirdAccount, BigNumber.from("50000000000000000000000")); //50k tokens => 5%

  await delegate(governanceToken, deployer);
  log("Delegated!")
  log("Checking votes...");
  await getVotes(governanceToken.address, deployer);
  await getVotes(governanceToken.address, secondAccount);
  await getVotes(governanceToken.address, thirdAccount);
  log("Checking delegates...");
  await getDelegates(governanceToken.address, deployer);
  await getDelegates(governanceToken.address, secondAccount);
  await getDelegates(governanceToken.address, thirdAccount);
}

const transfer = async (governanceToken: any, to: string, amount: BigNumber) => {
  // const governanceToken = await ethers.getContract("GovernanceToken"); // name, address
  // transfer tokens to the given account
  const tx = await governanceToken.transfer(to, amount);
  await tx.wait(1);
  console.log(`Balance of ${to}: ${await governanceToken.balanceOf(to)}`);
}

const delegate = async (governanceToken: any, delegatedAccount: string) => {
  // const governanceToken = await ethers.getContract("GovernanceToken"); // name, address
  // delegate comes from ERC20Votes
  // under the hood it calls the _moveVotingPower()
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  // if there is 0 checkpoints, we didn't delegate
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
}

export default sendTokens;
