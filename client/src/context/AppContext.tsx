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
  encodeData: Function
}

export const AppContext = React.createContext<Partial<AppContextProps>>({
  userContext: "Default",
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const userContext = "Default User";
  const web3 = new Web3(window.ethereum);
  // const web3 = new Web3(window.ethereum)
  const governorContract = new web3.eth.Contract(governorAbi, governorAddressRB);
  const boxContract = new web3.eth.Contract(boxAbi, boxAddressRB);
  const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddressRB);

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
