import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployTimeLock: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deploying TimeLock contract by ${deployer}`)
  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: [],
    log: true
  });
  log(`Deployed TimeLock contract at ${timelock.address}`)


}

export default deployTimeLock;
