import { network } from "hardhat";

export const moveBlocks = async (amount: number) => {
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: []
    });
  }
  console.log(`Moved ${amount} blocks.`)
}
