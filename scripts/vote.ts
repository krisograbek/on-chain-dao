import * as fs from "fs";
// @ts-ignore
import { network, ethers } from "hardhat";
import { developmentChains, proposalFile, VOTING_PERIOD } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

const index = 0

const main = async (proposalIndex: number) => {
  const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];

  const governor = await ethers.getContract("GovernorContract");

  console.log("Voting! In proposal", proposalId)
  // 0 => Against, 1 => For, 2 => Abstain
  const voteWay = 1;
  const reason = "The new value is much better";

  const proposalState = await governor.state(proposalId)
  console.log(`Current Proposal State: ${proposalState}`)

  const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);

  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log(`Voted! I said ${voteWay} because ${reason}`);
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })