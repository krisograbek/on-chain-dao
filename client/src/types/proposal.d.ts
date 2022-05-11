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
  proposalId: String;
  support: String;
  voter: String;
  weight: String;
  reason: String;
}
