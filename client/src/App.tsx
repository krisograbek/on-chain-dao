import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { EventEmitter } from 'stream';
import Web3 from 'web3';

import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProposalPage from './components/Proposals/ProposalPage';
import Proposals from './components/Proposals/Proposals';
import { boxAbi, boxAddress, governorAbi, governorAddress } from './utils/constants';


// using local node
const web3 = new Web3("ws://localhost:8545")
const governorContract = new web3.eth.Contract(governorAbi, governorAddress);
const boxContract = new web3.eth.Contract(boxAbi, boxAddress);

type FormData = {
  func: string,
  value: number,
  description: string
}

type EventReturn = {
  // returnValues should be of type Proposal from types/proposal.d.ts
  // However, calling updateProposals() failed because types didn't match
  // type 'any' is a workaround, not the real solution
  returnValues: any
}

function App() {
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [boxValue, setBoxValue] = useState<number>(0);

  const updateProposals = async (events: Array<EventReturn>): Promise<Array<Proposal>> => {
    const getProposals = events.map(async (event: EventReturn) => {
      const { proposer, proposalId, calldatas, description, targets } = event.returnValues;
      const state = await governorContract.methods.state(proposalId).call();
      const proposal: Proposal = { proposer, proposalId, calldatas, description, targets, state };
      console.log("Proposal", proposal);
      return proposal;
    });
    // events.map calls an async function
    // Promise.all() is required when we await an Array mapping
    const allProposals = await Promise.all(getProposals);
    return allProposals;
  }

  useEffect(() => {
    console.log("How often am I called?")
    // subscribe to the ProposalCreated event 
    governorContract.events.ProposalCreated({
      fromBlock: "latest"
    })
      // update state after the new event
      .on('data', async (event: EventEmitter) => {
        // TODO: Function to update state
        console.log("This should fire on Proposal Created");
        await getProposals()
      });
    // get proposals on the initial render
    const update = async () => {
      await getProposals();
    }
    update();
    const getBoxValue = async () => {
      const initialBoxValue = await boxContract.methods.retrieve().call();
      setBoxValue(initialBoxValue);
    }
    getBoxValue();
  }, []);

  const vote = async (proposalId: string, votingWay: number, reason: string) => {
    console.log("Voting", votingWay, reason)
    await governorContract.methods.castVoteWithReason(
      proposalId,
      votingWay,
      reason
    ).send({ from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' })
  }

  const getProposals = async () => {
    try {
      const events: Array<EventReturn> = await governorContract.getPastEvents('ProposalCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const allProposals = await updateProposals(events);
      setProposals(allProposals);
      console.log("Events", events);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    const encodedData = web3.eth.abi.encodeFunctionCall({
      name: 'store',
      type: 'function',
      inputs: [{
        type: 'uint256',
        name: 'newValue'
      }]
    }, [`${formData.value}`]);

    await governorContract.methods.propose(
      [boxAddress],
      [0],
      [encodedData],
      formData.description
    ).send({ from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' })
  }

  return (
    <Box>
      <Navbar boxValue={boxValue} onClick={() => getProposals()} />
      <Routes>
        <Route path="/" element={<Home proposals={proposals} handleSubmit={handleSubmit} />} />
        <Route path="proposals" element={<Proposals proposals={proposals} />} />
        <Route path="proposals/:proposalId" element={<ProposalPage proposals={proposals} vote={vote} />} />
      </Routes>
    </Box>
  );
}

export default App;
