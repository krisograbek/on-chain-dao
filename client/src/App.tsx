import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './App.css';
import Web3 from 'web3';

import { boxAbi, boxAddress, governorAbi, governorAddress } from './utils/constants';
import Proposals from './components/Proposals/Proposals';
import Navbar from './components/Navbar';
import ProposalForm from './components/Proposals/ProposalForm';
import { EventEmitter } from 'stream';
import Home from './components/Home';

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
  // event: string,
  // address: string,
  returnValues: any
}


function App() {
  const [proposals, setProposals] = useState<Array<Proposal>>([]);

  // console.log(governorContract)

  const updateProposals = async (events: Array<EventReturn>): Promise<Array<Proposal>> => {
    const getProposals = events.map(async (event: EventReturn) => {
      const { proposer, proposalId, calldatas, description, targets } = event.returnValues;
      const state = await governorContract.methods.state(proposalId).call();
      const proposal: Proposal = { proposer, proposalId, calldatas, description, targets, state };
      console.log("Proposal", proposal);
      return proposal;
    });
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
  }, []);

  const getProposals = async () => {
    try {
      const events: Array<EventReturn> = await governorContract.getPastEvents('ProposalCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      // const allProposals = await Promise.all(updateProposals(events));
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
      <Navbar onClick={() => getProposals()} />
      <Home proposals={proposals} handleSubmit={handleSubmit} />
    </Box>
  );
}

export default App;
