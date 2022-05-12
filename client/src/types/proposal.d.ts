// I had to update tsconfig.json with
//   "paths": {
//   "*": [
//     "types/*.d.ts"
//   ]
// }

declare interface Proposal {
  proposer: string;
  proposalId: string;
  calldatas: Array<string>;
  description: number;
  targets: Array<string>;
  state: number;
}

declare interface VoteInterface {
  proposalId: string;
  support: string;
  voter: string;
  weight: string;
  reason: string;
}
