import { network } from "hardhat";

export const moveBlocks = async (amount: number) => {
  console.log(`Moving ${amount} blocks.`)
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: []
    });
  }
  console.log(`Moved ${amount} blocks.`)
}
