import React from 'react'
import Typography from '@mui/material/Typography';
import Proposal from './Proposal';

type Props = {
  proposals: Array<Proposal>
}

const Proposals = ({ proposals }: Props) => {
  return (
    <div>
      <Typography variant='h3'>
        All Proposals
      </Typography>
      {proposals.map((proposal: Proposal) => (
        <div key={proposal.proposalId}>
          <Proposal proposal={proposal} />
        </div>
      ))}
    </div>
  );
};

export default Proposals;