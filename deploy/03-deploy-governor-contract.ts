import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } from "../helper-hardhat-config";

const deployGovernorContract: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deploying Governor Contract by ${deployer}`);

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [],
    log: true
  });

  log(`Deployed Governor contract at ${governorContract.address}`);

}

export default deployGovernorContract;
