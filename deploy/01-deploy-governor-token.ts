import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// @ts-ignore
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

const deployGovernanceToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer, secondAccount, thirdAccount } = await getNamedAccounts();
  log("Deploying governance token by ", deployer)
  const governanceToken = await deploy("GovernanceToken", { // contract name
    from: deployer,
    args: [],
    log: true
  });

  const tokenContract = await ethers.getContract("GovernanceToken");

  // log(tokenContract)
  log("Connecting...")
  tokenContract.connect(secondAccount);
  // log(tokenContract)

  log(`Deployed govenrance token to ${governanceToken.address}`)

  await delegate(tokenContract, deployer);
  log("Delegated!")

  // await delegate(tokenContract, secondAccount);
  // log("Delegated!")

  // await delegate(tokenContract, thirdAccount);
  // log("Delegated!")

  log("Checking votes before transfer...");
  await getVotes(governanceToken.address, deployer);
  // transfering to other accounts
  await transfer(governanceToken.address, secondAccount, BigNumber.from("50000000000000000000000")); //50k tokens => 5%
  log("Transfered!")
  await transfer(governanceToken.address, thirdAccount, BigNumber.from("50000000000000000000000")); //50k tokens => 5%
  log("Transfered!")
  log("Checking votes...");
  await getVotes(governanceToken.address, deployer);
  await getVotes(governanceToken.address, secondAccount);
  await getVotes(governanceToken.address, thirdAccount);
  log("Checking delegates...");
  await getDelegates(governanceToken.address, deployer);
  await getDelegates(governanceToken.address, secondAccount);
  await getDelegates(governanceToken.address, thirdAccount);

}

const delegate = async (governanceToken: any, delegatedAccount: string) => {
  // const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress); // name, address
  // delegate comes from ERC20Votes
  // under the hood it calls the _moveVotingPower()
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  // if there is 0 checkpoints, we didn't delegate
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
}

const transfer = async (governanceTokenAddress: string, to: string, amount: BigNumber) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress); // name, address
  // transfer tokens to the given account
  const tx = await governanceToken.transfer(to, amount);
  await tx.wait(1);
  console.log(`Balance of ${to}: ${await governanceToken.balanceOf(to)}`);
}

export const getVotes = async (governanceTokenAddress: string, account: string) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress); // name, address
  // transfer tokens to the given account
  console.log(`Votes of ${account}: ${await governanceToken.getVotes(account)}`);
}

export const getDelegates = async (governanceTokenAddress: string, account: string) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress); // name, address
  // transfer tokens to the given account
  console.log(`Votes of ${account} are delegated to ${await governanceToken.delegates(account)}`);
}

export default deployGovernanceToken;
