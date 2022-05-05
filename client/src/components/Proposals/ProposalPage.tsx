import Box from '@mui/material/Box';
import React from 'react';
import { useParams } from 'react-router-dom';

const ProposalPage = () => {
  const params = useParams();
  console.log("I am a proposal page")
  return (
    <Box sx={{ my: 1 }}>
      {params.proposalId}
    </Box>

  )
}

export default ProposalPage;