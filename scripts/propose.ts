// @ts-ignore
import { ethers, network } from 'hardhat';
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalFile
} from '../helper-hardhat-config';
import { moveBlocks } from '../utils/move-blocks';
import * as fs from "fs";

export const propose = async (functionToCall: string, args: any[], proposalDescription: string) => {
  const box = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernorContract");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}.`);
  console.log(`Description ${proposalDescription}.`);

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  const proposeReceipt = await proposeTx.wait(1);

  // propose emits the ProposalCreated event and proposalId is one of the params
  const proposalId = proposeReceipt.events[0].args.proposalId;

  let proposalState = await governor.state(proposalId)
  console.log(`After proposing the state is: ${proposalState}`)

  if (developmentChains.includes(network.name)) {
    console.log("Name Network", network.name);
    await moveBlocks(VOTING_DELAY + 1);
  }

  proposalState = await governor.state(proposalId)
  console.log(`State after moving blocks: ${proposalState}`)

  // read proposals from our proposals.json file
  let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  // update proposals
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  // upsate the file
  fs.writeFileSync(proposalFile, JSON.stringify(proposals));
}

propose(FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
  })
