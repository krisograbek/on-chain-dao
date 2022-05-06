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
