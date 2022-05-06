import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { getThemeColor, stateEnum } from '../../utils/helpers';
import { Link } from 'react-router-dom';

type Props = {
  proposal: Proposal
}

const Proposal = ({ proposal }: Props) => {
  const { proposer, proposalId, calldatas, description, targets, state } = proposal;
  const currentState = stateEnum[state];
  const color = getThemeColor(currentState);
  return (
    <Box sx={{ my: 1 }} >
      <Card sx={{ border: `2px solid ${color}` }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: color }}>
            State: {stateEnum[state]}
          </Typography>
          <Typography variant="h6" sx={{ my: 1 }}>
            {description}
          </Typography>
          {/* <Typography>
            ID: {proposalId}
          </Typography> */}
          {/* <Typography>
            Changing Contract: {targets}
          </Typography> */}
          <Typography>
            Proposed By: {proposer}
          </Typography>
        </CardContent>
        <CardActions>
          <Link to={`/proposals/${proposalId}`} >
            <Button size='large' >
              DETAILS
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>

  )
}

export default Proposal;