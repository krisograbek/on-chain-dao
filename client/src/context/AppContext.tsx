import React, { MouseEventHandler, useEffect, useState } from "react"
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { boxAbi, boxAddress, boxAddressRB, governorAbi, governorAddress, governorAddressRB, tokenAbi, tokenAddress, tokenAddressRB } from '../utils/constants';

type AppContextProps = {
  user: string,
  isLocalDev: boolean
  web3: Web3,
  governorContract: Contract,
  boxContract: Contract,
  tokenContract: Contract,
  connectWallet: MouseEventHandler<HTMLButtonElement>
}

const isLocalDev = true;

const web3 = isLocalDev ? new Web3("ws://localhost:8545") : new Web3(window.ethereum);


const accounts = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
]

const getGovernorContract = (web3: Web3) => {
  const address = isLocalDev ? governorAddress : governorAddressRB
  const contract = new web3.eth.Contract(governorAbi, address);
  return contract;
}

const getBoxContract = (web3: Web3) => {
  const address = isLocalDev ? boxAddress : boxAddressRB
  const contract = new web3.eth.Contract(boxAbi, address);
  return contract;
}

const getTokenContract = (web3: Web3) => {
  const address = isLocalDev ? tokenAddress : tokenAddressRB
  const contract = new web3.eth.Contract(tokenAbi, address);
  return contract;
}

export const AppContext = React.createContext<AppContextProps>({
  user: "",
  isLocalDev: isLocalDev,
  web3: web3,
  governorContract: getGovernorContract(web3),
  boxContract: getBoxContract(web3),
  tokenContract: getTokenContract(web3),
  connectWallet: () => { }
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState("");
  // const web3 = new Web3(window.ethereum)
  const governorContract = getGovernorContract(web3);
  const boxContract = getBoxContract(web3);
  const tokenContract = getTokenContract(web3);


  useEffect(() => {
    if (isLocalDev) {
      setUser(accounts[0])
    }
  }, [])


  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install Metamask!")

      const walletAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      // const walletAccounts = await window.ethereum.request({ method: "eth_accounts" });
      console.log(walletAccounts);
      setUser(walletAccounts[0]);

    } catch (error) {
      console.log(error)

      throw new Error("Ethereum object not detected")
    }
  }

  return (
    <AppContext.Provider value={{
      user,
      isLocalDev,
      web3,
      governorContract,
      boxContract,
      tokenContract,
      connectWallet
    }}>
      {children}
    </AppContext.Provider>
  )
}
