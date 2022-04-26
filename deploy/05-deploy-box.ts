import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";


const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deploying Box by ${deployer}`);

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true
  });

  log(`Deployed Box at ${box.address}`);

}

export default deployBox;
