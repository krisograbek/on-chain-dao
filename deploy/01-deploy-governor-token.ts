import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// @ts-ignore
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying governance token by ", deployer)
  const governanceToken = await deploy("GovernanceToken", { // contract name
    from: deployer,
    args: [],
    log: true
  })
  log(`Deployed govenrance token to ${governanceToken.address}`)

  await delegate(governanceToken.address, deployer);
  log("Delegated!")
}

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress); // name, address
  // delegate comes from ERC20Votes
  // under the hood it calls the _moveVotingPower()
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  // if there is 0 checkpoints, we didn't delegate
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
}

export default deployGovernanceToken;
