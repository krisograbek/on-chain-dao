import React from 'react'
import Proposal from './Proposal';

type Props = {
  proposals: Array<Proposal>
}

const Proposals = ({ proposals }: Props) => {
  return (
    <div>
      {proposals.map((proposal: Proposal) => (
        <div key={proposal.proposalId}>
          <Proposal proposal={proposal} />
        </div>
      ))}
    </div>
  );
};

export default Proposals;