import Box from '@mui/material/Box';
import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes } from "react-router-dom";
import { EventEmitter } from 'stream';

import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProposalPage from './components/Proposals/ProposalPage';
import Proposals from './components/Proposals/Proposals';
import { bigNumberToFloat, hashDescription } from './utils/helpers';
import { AppContext } from './context/AppContext';
import { boxAddressRB } from './utils/constants';

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

function App() {
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [boxValue, setBoxValue] = useState<number>(0);
  const [accountId, setAccountId] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<number>(0);
  const { user, governorContract, boxContract, tokenContract, web3, connectWallet } = useContext(AppContext);

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
    if (user) {
      const updateAvailableTokens = async () => {
        try {
          if (user) {
            const tokensAvailable = await getAvailableTokens(user);
            console.log(tokensAvailable);
          }
        } catch (error) {
          console.log(error)
        }
      }
      updateAvailableTokens();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const updateAvailableTokens = async () => {
        try {
          const tokensAvailable = await getAvailableTokens(user);
          console.log(tokensAvailable);
          setAvailableTokens(bigNumberToFloat(tokensAvailable));
        } catch (error) {
          console.log(error)
        }
      }
      updateAvailableTokens();
    }
  }, [accountId, user])

  const encodeData = (data: any) => web3.eth.abi.encodeFunctionCall({
    // name may also be a parameter of this function
    name: 'store',
    type: 'function',
    inputs: [{
      type: 'uint256',
      name: 'newValue'
    }]
  }, [`${data}`]);

  const updateProposals = async (events: Array<EventReturn>): Promise<Array<Proposal>> => {
    const getProposals = events.map(async (event: EventReturn) => {
      // console.log(event)
      const { proposer, proposalId, calldatas, description, targets, startBlock } = event.returnValues;
      const state = await governorContract.methods.state(proposalId).call();
      const proposal: Proposal = { proposer, proposalId, calldatas, description, targets, state, startBlock };
      console.log("Proposal", proposal);
      return proposal;
    });
    // events.map calls an async function
    // Promise.all() is required when we await an Array mapping
    const allProposals = await Promise.all(getProposals);
    // reverse order of propsals to see the newest on top
    const sorted = allProposals.sort((el1, el2) => parseInt(el2.startBlock) - parseInt(el1.startBlock))
    return sorted;
  }

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
    ).send({ from: user })
  }

  const queue = async (proposal: Proposal) => {
    const boxAddr = proposal.targets[0];
    console.log("Box", boxAddr);
    const descriptionHash = hashDescription(proposal.description);
    await governorContract.methods.queue(
      [boxAddr],
      [0],
      proposal.calldatas,
      descriptionHash
    ).send({ from: user })
  }

  const execute = async (proposal: Proposal) => {
    const boxAddr = proposal.targets[0];
    console.log("Box", boxAddr);
    const descriptionHash = hashDescription(proposal.description);
    await governorContract.methods.execute(
      [boxAddr],
      [0],
      proposal.calldatas,
      descriptionHash
    ).send({ from: user })
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault();
    const encodedData = encodeData(formData.value);

    await governorContract.methods.propose(
      [boxAddressRB],
      [0],
      [encodedData],
      formData.description
    ).send({ from: user })

    const array = await governorContract.methods.newProposals(2).call()
    console.log("Array after proposing", array)
  }

  const proposalElement = () => {
    return (
      <ProposalPage
        proposals={proposals}
        vote={vote}
        queue={queue}
        execute={execute}
        governorContract={governorContract}
        user={user}
        availableTokens={availableTokens}
      />
    )
  }

  return (
    <Box>
      <Navbar
        boxValue={boxValue}
        accounts={accounts}
        accountId={accountId}
        setAccountId={setAccountId}
        availableTokens={availableTokens}
        connectWallet={connectWallet}
        user={user}
      />
      <Routes>
        <Route path="/" element={<Home proposals={proposals} handleSubmit={handleSubmit} />} />
        <Route path="proposals" element={<Proposals proposals={proposals} />} />
        <Route path="proposals/:proposalId" element={proposalElement()} />
      </Routes>
    </Box>
  );
}

export default App;
