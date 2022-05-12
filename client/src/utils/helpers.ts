import { BigNumber, ethers } from "ethers";

export enum stateEnum {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export const shortenAddress = (address: string) => `${address.slice(0, 5)}...${address.slice(-3)}`;


export const getThemeColor = (state: string) => ["Succeeded", "Executed"].includes(state) ? 'green'
  : ["Defeated", "Canceled", "Expired"].includes(state) ? 'red'
    : state === "Active" ? 'blueviolet'
      : 'gray';


export const bigNumberToFloat = (input: String): number => {
  if (input === "") return 0;
  const converted = parseFloat(ethers.utils.formatEther(BigNumber.from(input)));
  return converted;
}

export const voteWayToString: { [key: string]: string } = {
  "0": "Against",
  "1": "For",
  "2": "Abstain",
}
