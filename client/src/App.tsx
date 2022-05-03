import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';

import { contractAbi, contractAddress } from './utils/constants';
import Proposals from './Proposals/Proposals';

// using local node
const web3 = new Web3("ws://localhost:8545")
const greeterContract = new web3.eth.Contract(contractAbi, contractAddress);

function App() {
  const [newGreetings, setNewGreetings] = useState("");
  const [greetings, setGreetings] = useState("")
  const [proposals, setProposals] = useState<Array<Proposal>>([]);

  console.log(greeterContract)

  // useEffect(() => {
  //   const initialGreets = async () => {
  //     const greetMsg = await greetMe()
  //     setGreetings(greetMsg);
  //   };
  //   initialGreets();
  // }, [])

  const getEvents = async () => {
    try {
      const events = await greeterContract.getPastEvents('ProposalCreated', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const allProposals: Array<Proposal> = events.map((event) => {
        const { proposer, proposalId, calldatas, description, targets } = event.returnValues;
        const proposal: Proposal = { proposer, proposalId, calldatas, description, targets };
        console.log("Proposal", proposal);
        return proposal;
      });
      setProposals(allProposals);
      console.log("Events", events);
    } catch (error) {
      console.log(error);
    }
  }

  const greetMe = async () => {
    const greetMsg = await greeterContract.methods.greet().call();
    return greetMsg;
  }

  const updateGreets = async () => {
    const greetMsg = await greeterContract.methods.setGreeting(newGreetings).send({ from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' })
    setGreetings(await greetMe())
  }

  return (
    <div className="App">
      <p>
        Hello
      </p>
      <button onClick={() => getEvents()}>
        Get Events
      </button>
      <Proposals proposals={proposals} />
      {/* <input placeholder="New greetings" type="text" value={newGreetings}
        onChange={(e) => setNewGreetings(e.target.value)}
      />
      <button onClick={() => updateGreets()}>
        Update Greetings
      </button>
      <h2>
        Current Greetings:
        <span style={{ color: "blueviolet" }}>
          &nbsp; {greetings}
        </span>
      </h2> */}
    </div>
  );
}

export default App;
