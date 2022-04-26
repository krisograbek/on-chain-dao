import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";


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

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);

  // transferOwnership comes from Ownable
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  log("Who the owner now?")

  log("Box owner address", await boxContract.owner());
  log("Time Lock address", timeLock.address);

}

export default deployBox;
