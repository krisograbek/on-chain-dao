import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './App.css';
import Web3 from 'web3';

import { boxAbi, boxAddress, governorAbi, governorAddress } from './utils/constants';
import Proposals from './components/Proposals/Proposals';
import Navbar from './components/Navbar';
import ProposalForm from './components/Proposals/ProposalForm';
import { EventEmitter } from 'stream';

// using local node
const web3 = new Web3("ws://localhost:8545")
const governorContract = new web3.eth.Contract(governorAbi, governorAddress);
const boxContract = new web3.eth.Contract(boxAbi, boxAddress);

type FormData = {
  func: string,
  value: number,
  description: string
}

function App() {
  const [newGreetings, setNewGreetings] = useState("");
  const [greetings, setGreetings] = useState("")
  const [proposals, setProposals] = useState<Array<Proposal>>([]);

  // console.log(governorContract)

  useEffect(() => {
    // subscribe to the ProposalCreated event 
    governorContract.events.ProposalCreated({
      fromBlock: "latest"
    })
      // update state after the new event
      .on('data', (event: EventEmitter) => {
        // TODO: Function to update state
        console.log("This should fire on Proposal Created", event);
      })
  })

  const getEvents = async () => {
    try {
      const events = await governorContract.getPastEvents('ProposalCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const getProposals = events.map(async (event) => {
        const { proposer, proposalId, calldatas, description, targets } = event.returnValues;
        const state = await governorContract.methods.state(proposalId).call();
        const proposal: Proposal = { proposer, proposalId, calldatas, description, targets, state };
        console.log("Proposal", proposal);
        return proposal;
      });
      const allProposals = await Promise.all(getProposals);
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

  const greetMe = async () => {
    const greetMsg = await governorContract.methods.greet().call();
    return greetMsg;
  }

  const updateGreets = async () => {
    const greetMsg = await governorContract.methods.setGreeting(newGreetings).send({ from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' })
    setGreetings(await greetMe())
  }

  return (
    <Container maxWidth='lg'>
      <Grid container className="App" spacing={2}>
        <Grid item sm={12}>
          <Navbar onClick={() => getEvents()} />
        </Grid>
        <Grid item sm={12} md={8}>
          <Proposals proposals={proposals} />
        </Grid>
        <Grid item sm={12} md={4}>
          <ProposalForm handleSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
