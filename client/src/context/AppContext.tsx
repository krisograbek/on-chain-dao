import React, { useState } from "react"
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { boxAbi, boxAddress, boxAddressRB, governorAbi, governorAddress, governorAddressRB, tokenAbi, tokenAddress, tokenAddressRB } from '../utils/constants';

type AppContextProps = {
  userContext: string,
  web3: Web3,
  governorContract: Contract,
  boxContract: Contract,
  tokenContract: Contract,
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
  userContext: "Default",
  web3: web3,
  governorContract: getGovernorContract(web3),
  boxContract: getBoxContract(web3),
  tokenContract: getTokenContract(web3),
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const userContext = "Default User";
  // const web3 = new Web3(window.ethereum)
  const governorContract = getGovernorContract(web3);
  const boxContract = getBoxContract(web3);
  const tokenContract = getTokenContract(web3);

  return (
    <AppContext.Provider value={{
      userContext,
      web3,
      governorContract,
      boxContract,
      tokenContract,
    }}>
      {children}
    </AppContext.Provider>
  )
}
