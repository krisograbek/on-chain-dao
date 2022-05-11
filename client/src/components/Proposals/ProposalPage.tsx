import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EventEmitter } from 'stream';
import { getThemeColor, shortenAddress, stateEnum } from '../../utils/helpers';
import Vote from './Vote';

type Props = {
  proposals: Array<Proposal>,
  user: string,
  vote: Function,
  queue: Function,
  execute: Function,
  governorContract: any
}

type VoteReturnValues = {
  proposalId: string,
  support: string,
  voter: string,
  weight: string,
  reason: string,
}

type VoteEventReturn = {
  // returnValues should be of type Proposal from types/proposal.d.ts
  // However, calling updateProposals() failed because types didn't match
  // type 'any' is a workaround, not the real solution
  returnValues: VoteReturnValues
}


const ProposalPage = ({ proposals, vote, queue, execute, governorContract }: Props) => {
  const params = useParams();
  // find the proposal with proposal ID from the URL params
  const proposal = proposals.find(p => p.proposalId === params.proposalId);
  const [votingWay, setVotingWay] = useState<number>(3);
  const [reason, setReason] = useState<string>("");
  const [votes, setVotes] = useState<Array<VoteInterface>>([]);


  useEffect(() => {
    governorContract.events.VoteCast({
      fromBlock: 0
    })
      .on('data', async (event: EventEmitter) => {
        // console.log("You Just Voted");
        await getVotes();
      });

    // update Votes from events
    const update = async () => {
      await getVotes();
    }
    update();
  }, []);

  const updateVotes = async (events: Array<VoteEventReturn>): Promise<Array<VoteInterface>> => {
    const getVotes = events.map(async (event: VoteEventReturn) => {
      const { proposalId, support, voter, weight, reason } = event.returnValues;
      const vote: VoteInterface = { proposalId, support, voter, weight, reason };
      return vote;
    });
    // events.map calls an async function
    // Promise.all() is required when we await an Array mapping
    const allVotes = await Promise.all(getVotes);
    return allVotes;
  }

  const getVotes = async () => {
    try {
      const events: Array<VoteEventReturn> = await governorContract.getPastEvents('VoteCast', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      const allVotes = await updateVotes(events);
      const filteredVotes = allVotes.filter((vote: VoteInterface) => vote.proposalId === params.proposalId);
      setVotes(filteredVotes);
      console.log("Votes", filteredVotes);
    } catch (error) {
      console.log(error);
    }
  }

  // const getVotes = async() => {
  //   try {
  //     const events: Array<VoteEventReturn>
  //   }
  // }

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
          <Vote
            color={color}
            votingWay={votingWay}
            setVotingWay={setVotingWay}
            reason={reason}
            setReason={setReason}
            vote={vote}
            proposalId={proposalId}
            governorContract={governorContract}
          />
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

