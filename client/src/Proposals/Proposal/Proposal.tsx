import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { stateEnum } from '../../utils/mapState';

type Props = {
  proposal: Proposal
}

const Proposal = ({ proposal }: Props) => {
  const { proposer, proposalId, calldatas, description, targets, state } = proposal;
  return (
    <Box sx={{ my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ my: 2 }}>
            State: {stateEnum[state]}
          </Typography>
          <Typography variant="h6" sx={{ my: 2 }}>
            Proposed By: {proposer}
          </Typography>
          <Typography>
            ID: {proposalId}
          </Typography>
          <Typography>
            Changing Contract: {targets}
          </Typography>
          <Typography>
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button >
            DETAILS
          </Button>
        </CardActions>
      </Card>
    </Box>

  )
}

export default Proposal;