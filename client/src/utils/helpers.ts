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
