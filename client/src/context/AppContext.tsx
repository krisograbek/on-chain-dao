import React, { MouseEventHandler, useState } from "react"
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { boxAbi, boxAddress, boxAddressRB, governorAbi, governorAddress, governorAddressRB, tokenAbi, tokenAddress, tokenAddressRB } from '../utils/constants';

type AppContextProps = {
  user: string,
  web3: Web3,
  governorContract: Contract,
  boxContract: Contract,
  tokenContract: Contract,
  connectWallet: MouseEventHandler<HTMLButtonElement>
}

const web3 = new Web3(window.ethereum);


const getGovernorContract = (web3: Web3) => {
  const contract = new web3.eth.Contract(governorAbi, governorAddressRB);
  return contract;
}

const getBoxContract = (web3: Web3) => {
  const contract = new web3.eth.Contract(boxAbi, boxAddressRB);
  return contract;
}

const getTokenContract = (web3: Web3) => {
  const contract = new web3.eth.Contract(tokenAbi, tokenAddressRB);
  return contract;
}

export const AppContext = React.createContext<AppContextProps>({
  user: "",
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
