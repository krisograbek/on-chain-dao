import React from 'react'
import Box from '@mui/material/Box';

type Props = {
  proposal: Proposal
}

const Proposal = ({ proposal }: Props) => {
  const { proposalId, description } = proposal;
  return (
    <Box sx={{ my: 4 }}>
      {proposalId} {description}
    </Box>
  )
}

export default Proposal;