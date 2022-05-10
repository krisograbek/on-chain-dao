import { network } from "hardhat";

export const moveTime = async (amount: number) => {
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved ${amount} seconds!`);
}

moveTime(3601)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
  });

