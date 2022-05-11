import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getThemeColor, shortenAddress, stateEnum } from '../../utils/helpers';
import Vote from './Vote';

type Props = {
  proposals: Array<Proposal>,
  vote: Function,
  queue: Function,
  execute: Function,
}

const ProposalPage = ({ proposals, vote, queue, execute }: Props) => {
  const params = useParams();
  // find the proposal with proposal ID from the URL params
  const proposal = proposals.find(p => p.proposalId === params.proposalId);
  const [votingWay, setVotingWay] = useState<number>(3);
  const [reason, setReason] = useState<string>("");

  // Find may return undefined
  if (!proposal) {
    return (
      <div>Proposal with id ${params.proposalId} doesn't exist</div>
    )
  }

  const { proposer, proposalId, description, state, targets } = proposal;
  const color = getThemeColor(stateEnum[state]);
  return (
    <Container maxWidth='lg' sx={{ mt: 15 }}>
      <Grid container justifyContent="space-between" alignContent="center">
        <Grid item sm={3} textAlign="center" sx={{ color: color }}>
          <Typography className={`${stateEnum[state] === "Active" ? "activeBox" : ""}`} variant='h5' sx={{ p: 1, border: 1 }}>
            {/* Todo replace box with better looking and accurate Icons */}
            <Box sx={{
              mx: 2,
              borderRadius: '50%',
              backgroundColor: color,
              width: 20,
              height: 20,
              display: 'inline-block',
            }} />
            {stateEnum[state]}
          </Typography>
        </Grid>
        <Grid item sm={9} textAlign="right" >
          <Typography sx={{ p: 2 }}>
            Proposed By: {shortenAddress(proposer)}
          </Typography>
        </Grid>
        {/* Active State */}
        {stateEnum[state] === "Active" && (
          <Vote color={color} votingWay={votingWay} setVotingWay={setVotingWay} reason={reason} setReason={setReason} vote={vote} proposalId={proposalId} />
        )}
        <Grid item sm={12} sx={{ py: 5 }}>
          {stateEnum[state] === "Succeeded" && (
            <Grid container>
              <Button onClick={e => queue()}>Queue</Button>
            </Grid>
          )}
        </Grid>
        <Grid item sm={12} sx={{ py: 5 }}>
          {stateEnum[state] === "Queued" && (
            <Grid container>
              <Button onClick={e => execute()}>Execute</Button>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Box>
            <Typography variant="h5">
              Details
            </Typography>
            <Typography variant="h6">
              {description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container >

  )
}

export default ProposalPage;

