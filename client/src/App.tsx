import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './App.css';
import Web3 from 'web3';

import { contractAbi, contractAddress } from './utils/constants';
import Proposals from './components/Proposals/Proposals';
import Navbar from './components/Navbar';
import ProposalForm from './components/Proposals/ProposalForm';

// using local node
const web3 = new Web3("ws://localhost:8545")
const governorContract = new web3.eth.Contract(contractAbi, contractAddress);

function App() {
  const [newGreetings, setNewGreetings] = useState("");
  const [greetings, setGreetings] = useState("")
  const [proposals, setProposals] = useState<Array<Proposal>>([]);

  console.log(governorContract)

  // useEffect(() => {
  //   const initialGreets = async () => {
  //     const greetMsg = await greetMe()
  //     setGreetings(greetMsg);
  //   };
  //   initialGreets();
  // }, [])

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
      <Grid container className="App">
        <Grid item sm={6}>
          <Navbar onClick={() => getEvents()} />
        </Grid>
        <Grid item sm={12} md={8}>
          <Proposals proposals={proposals} />
        </Grid>
        <Grid item sm={12} md={4}>
          <ProposalForm />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
