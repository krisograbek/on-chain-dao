import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EventEmitter } from 'stream';
import { bigNumberToFloat, getThemeColor, shortenAddress, stateEnum } from '../../utils/helpers';
import Vote from './Vote';

type Props = {
  proposals: Array<Proposal>,
  user: String,
  vote: Function,
  queue: Function,
  execute: Function,
  governorContract: any,
  // getAvailableTokens: Function,
}

type VoteReturnValues = {
  proposalId: string,
  support: string,
  voter: string,
  weight: string,
  reason: string,
}

type VoteEventReturn = {
  returnValues: VoteReturnValues
}

type VotingResults = {
  for: number,
  against: number,
  abstain: number,
  // voters: Array<string>
}

const ProposalPage = ({ proposals, vote, queue, execute, governorContract, user }: Props) => {
  const params = useParams();
  // find the proposal with proposal ID from the URL params
  const proposal = proposals.find(p => p.proposalId === params.proposalId);
  const [votingWay, setVotingWay] = useState<number>(3); // initial value is 3 so it's neither Against, For, nor Abstain
  const [reason, setReason] = useState<string>("");
  // votes for this proposal taken from VoteCast event in the Governor.sol
  const [votes, setVotes] = useState<Array<VoteInterface>>([]);
  // voting results for this proposal
  const [votingResults, setVotingResults] = useState<VotingResults>({ for: 0, against: 0, abstain: 0 });
  const [voters, setVoters] = useState<Array<String>>([]);
  const [usersVoting, setUsersVoting] = useState<Pick<VoteReturnValues, 'weight' | 'support'>>({ weight: "", support: "" });

  useEffect(() => {
    governorContract.events.VoteCast({
      fromBlock: 0
    })
      .on('data', async (event: EventEmitter) => {
        await getVotes();
      });

    // update Votes from events
    const update = async () => {
      await getVotes();
    }
    update();
  }, []);

  useEffect(() => {
    // Whenever we change user or the list of voters changes,
    // we want to know if current user has already voted.
    if (voters.includes(user)) {
      const usersVote = votes.find((v) => v.voter.toLowerCase() === user);
      if (usersVote) {
        setUsersVoting({ weight: usersVote.weight, support: usersVote.support });
      }
    }
  }, [user, voters]);

  useEffect(() => {
    // TODO: move it to a single function?
    // ["0", "1", "2"].map((answer) => getTotal(votes, answer))
    const totalAgainst = votes.filter((v) => v.support === "0").map((v) => bigNumberToFloat(v.weight)).reduce((prev, curr) => prev + curr, 0);
    const totalFor = votes.filter((v) => v.support === "1").map((v) => bigNumberToFloat(v.weight)).reduce((prev, curr) => prev + curr, 0);
    const totalAbstain = votes.filter((v) => v.support === "2").map((v) => bigNumberToFloat(v.weight)).reduce((prev, curr) => prev + curr, 0);
    console.log("For: ", totalFor, typeof totalFor);
    console.log("Against: ", totalAgainst, typeof totalAgainst);
    console.log("Abstain: ", totalAbstain);
    setVotingResults({ for: totalFor, against: totalAgainst, abstain: totalAbstain });
  }, [votes]);

  const updateVotes = async (events: Array<VoteEventReturn>): Promise<Array<VoteInterface>> => {
    const getVotesFromEvents = events.map(async (event: VoteEventReturn) => {
      const { proposalId, support, voter, weight, reason } = event.returnValues;
      const vote: VoteInterface = { proposalId, support, voter, weight, reason };
      return vote;
    });
    // events.map calls an async function
    // Promise.all() is required when we await an Array mapping
    const allVotes = await Promise.all(getVotesFromEvents);
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
      const currentVoters = filteredVotes.map((v) => v.voter.toLowerCase());
      setVotes(filteredVotes);
      setVoters(currentVoters);
      console.log("Votes", filteredVotes);
    } catch (error) {
      console.log(error);
    }
  }

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
        {stateEnum[state] !== "Pending" && (
          <Grid item sm={12} sx={{ py: 3 }}>
            <Typography variant='h4'>Voting Results</Typography>
            <Typography variant='h6'>Total - {votingResults.for + votingResults.against + votingResults.abstain}</Typography>
            <Typography variant='h6' color="green">For - {votingResults.for}</Typography>
            <Typography variant='h6' color="red">Against - {votingResults.against}</Typography>
            <Typography variant='h6' color="gray">Abstain - {votingResults.abstain}</Typography>
          </Grid>
        )}
        {/* Active State */}
        {(stateEnum[state] === "Active" && !voters.includes(user)) ? (
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
        ) : (stateEnum[state] === "Active" && voters.includes(user)) && (
          <Grid item sm={12} sx={{ py: 5 }}>
            <Typography>You have already voted {usersVoting.support} with {bigNumberToFloat(usersVoting.weight)} tokens </Typography>
          </Grid>
        )}
        {stateEnum[state] === "Succeeded" && (
          <Grid item sm={12} sx={{ py: 5 }}>
            <Grid container>
              <Button onClick={e => queue()}>Queue</Button>
            </Grid>
          </Grid>
        )}
        {stateEnum[state] === "Queued" && (
          <Grid item sm={12} sx={{ py: 5 }}>
            <Grid container>
              <Button onClick={e => execute()}>Execute</Button>
            </Grid>
          </Grid>
        )}
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

