// @ts-ignore
import { ethers } from 'hardhat';
import { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from '../helper-hardhat-config';

export const propose = async (functionToCall: string, args: any[], proposalDescription: string) => {
  const box = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernorContract");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}.`);

  const proposeTx = governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  await proposeTx.wait(1);

}

propose(FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
  })
