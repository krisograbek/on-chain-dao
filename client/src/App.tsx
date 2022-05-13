import Box from '@mui/material/Box';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { EventEmitter } from 'stream';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { utils } from 'ethers';

import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProposalPage from './components/Proposals/ProposalPage';
import Proposals from './components/Proposals/Proposals';
import { boxAbi, boxAddress, boxAddressRB, governorAbi, governorAddress, governorAddressRB, tokenAbi, tokenAddress, tokenAddressRB } from './utils/constants';
import { bigNumberToFloat, hashDescription } from './utils/helpers';


let web3: Web3;
let governorContract: Contract;
let boxContract: Contract;
let tokenContract: Contract;

if (window.ethereum) {
  console.log("Metamask detected")
  web3 = new Web3(window.ethereum);
  // const web3 = new Web3(window.ethereum)
  governorContract = new web3.eth.Contract(governorAbi, governorAddressRB);
  boxContract = new web3.eth.Contract(boxAbi, boxAddressRB);
  tokenContract = new web3.eth.Contract(tokenAbi, tokenAddressRB);
} else {
  // using local node
  web3 = new Web3("ws://localhost:8545");
  governorContract = new web3.eth.Contract(governorAbi, governorAddress);
  boxContract = new web3.eth.Contract(boxAbi, boxAddress);
  tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

}


const accounts = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
]

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

const encodeData = (data: any) => web3.eth.abi.encodeFunctionCall({
  // name may also be a parameter of this function
  name: 'store',
  type: 'function',
  inputs: [{
    type: 'uint256',
    name: 'newValue'
  }]
}, [`${data}`]);

function App() {
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [boxValue, setBoxValue] = useState<number>(0);
  const [accountId, setAccountId] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<number>(0);
  const [user, setUser] = useState<string>("");

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
    // const updateAvailableTokens = async () => {
    //   try {
    //     const tokensAvailable = await getAvailableTokens(accounts[accountId]);
    //     console.log(tokensAvailable);
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // updateAvailableTokens();
  }, []);

  useEffect(() => {
    // const updateAvailableTokens = async () => {
    //   try {
    //     const tokensAvailable = await getAvailableTokens(accounts[accountId]);
    //     setAvailableTokens(bigNumberToFloat(tokensAvailable));
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // updateAvailableTokens();
  }, [accountId])

  const getProposals = async () => {
    try {
      const events: Array<EventReturn> = await governorContract.getPastEvents('ProposalCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const allProposals = await updateProposals(events);
      setProposals(allProposals);
      // console.log("Events", events);
    } catch (error) {
      console.log(error);
    }
  }

  const vote = async (proposalId: string, votingWay: number, reason: string) => {
    console.log("Voting", votingWay, reason)
    await governorContract.methods.castVoteWithReason(
      proposalId,
      votingWay,
      reason
    ).send({ from: accounts[accountId] })
  }

  const queue = async () => {
    const encodedData = encodeData(21);
    console.log(encodedData);
    const descriptionHash = hashDescription("We need to change it to 21!");
    await governorContract.methods.queue(
      [boxAddress],
      [0],
      [encodedData],
      descriptionHash
    ).send({ from: accounts[accountId] })
  }

  const execute = async () => {
    const encodedData = encodeData(21);
    console.log(encodedData);
    const descriptionHash = hashDescription("We need to change it to 21!");
    await governorContract.methods.execute(
      [boxAddress],
      [0],
      [encodedData],
      descriptionHash
    ).send({ from: accounts[accountId] })
    console.log("Updating Box...")
    const newBoxValue = await boxContract.methods.retrieve().call();
    setBoxValue(newBoxValue);
    console.log("Updated Box!")
  }

  const getAvailableTokens = async (currentUser: string) => {
    console.log("Show ME!")
    const tokensAvailable = await tokenContract.methods.getVotes(currentUser).call();
    return tokensAvailable;
  }

  const connectWallet = async () => {
    const walletAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log(walletAccounts);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    const encodedData = encodeData(formData.value);

    await governorContract.methods.propose(
      [boxAddress],
      [0],
      [encodedData],
      formData.description
    ).send({ from: accounts[accountId] })
  }

  const proposalElement = () => {
    return (
      <ProposalPage
        proposals={proposals}
        vote={vote}
        queue={queue}
        execute={execute}
        governorContract={governorContract}
        user={accounts[accountId]}
        availableTokens={availableTokens}
      />
    )
  }

  return (
    <Box>
      <Navbar boxValue={boxValue} accounts={accounts} accountId={accountId} setAccountId={setAccountId} availableTokens={availableTokens} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Home proposals={proposals} handleSubmit={handleSubmit} />} />
        <Route path="proposals" element={<Proposals proposals={proposals} />} />
        <Route path="proposals/:proposalId" element={proposalElement()} />
      </Routes>
    </Box>
  );
}

export default App;
