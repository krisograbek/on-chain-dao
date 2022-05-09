import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
// @ts-ignore
import { ethers } from "hardhat";


const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`Deploying Box by ${deployer}`);

  const box = await deploy("Box", {
    from: deployer,
    args: [13],
    log: true
  });

  log(`Deployed Box at ${box.address}`);

  const boxContract = await ethers.getContractAt("Box", box.address);
  const boxInitialValue = await boxContract.retrieve();
  log(`Box Initial Value ${boxInitialValue}`);

  const timeLock = await ethers.getContract("TimeLock");

  // transferOwnership comes from Ownable
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  log("Who the owner now?")

  log("Box owner address", await boxContract.owner());
  log("Time Lock address", timeLock.address);

}

export default deployBox;
