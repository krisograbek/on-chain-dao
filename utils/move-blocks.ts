import { network } from "hardhat";
import { argv } from "process";

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

moveBlocks(3)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
  });
