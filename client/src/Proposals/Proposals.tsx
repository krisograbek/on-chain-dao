import React from 'react'

type Props = {
  proposals: Array<Proposal>
}

const Proposals = ({ proposals }: Props) => {
  return (
    <div>
      {proposals.map((proposal: Proposal) => (
        <div key={proposal.proposalId}>
          {proposal.description}
        </div>
      ))}
    </div>
  );
};

export default Proposals;