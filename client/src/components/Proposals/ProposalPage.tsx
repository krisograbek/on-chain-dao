import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useParams } from 'react-router-dom';
import { shortenAddress } from '../../utils/helpers';

type Props = {
  proposals: Array<Proposal>
}

const ProposalPage = ({ proposals }: Props) => {
  const params = useParams();
  // find the proposal with proposal ID from the URL params
  const proposal = proposals.find(p => p.proposalId === params.proposalId);
  console.log("I am a proposal page", proposal);

  // Proposal may be undefined
  if (!proposal) {
    return (
      <div>No such proposal</div>
    )
  }

  const { proposer, proposalId, description, state, targets } = proposal;
  return (
    <Container maxWidth='lg' sx={{ mt: 5 }}>
      <Box sx={{ my: 1 }}>
        {proposalId}
      </Box>
      <Typography>
        Proposed By: {shortenAddress(proposer)}
      </Typography>
    </Container>

  )
}

export default ProposalPage;