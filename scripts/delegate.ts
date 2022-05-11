import { HardhatRuntimeEnvironment } from "hardhat/types";

export const delegate = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { log } = deployments;
  const { deployer, secondAccount, thirdAccount } = await getNamedAccounts();

}