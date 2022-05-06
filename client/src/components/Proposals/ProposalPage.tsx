import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { shortenAddress, stateEnum, getThemeColor } from '../../utils/helpers';

type Props = {
  proposals: Array<Proposal>
}

const ProposalPage = ({ proposals }: Props) => {
  const params = useParams();
  // find the proposal with proposal ID from the URL params
  const proposal = proposals.find(p => p.proposalId === params.proposalId);
  const [votingWay, setVotingWay] = useState<number>(3);
  console.log("I am a proposal page", proposal);

  // Proposal may be undefined
  if (!proposal) {
    return (
      <div>Proposal with id ${params.proposalId} doesn't exist</div>
    )
  }

  const { proposer, proposalId, description, state, targets } = proposal;
  const color = getThemeColor(stateEnum[state]);
  return (
    <Container maxWidth='lg' sx={{ mt: 5 }}>
      <Box sx={{ my: 1 }}>
        {proposalId}
      </Box>
      <Typography>
        Proposed By: {shortenAddress(proposer)}
      </Typography>
      {stateEnum[state] === "Active" && (
        <Grid container direction="column">
          <Grid item>
            <Typography variant='h3' color={color}>Voting is now Active</Typography>

            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Select option</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                row
                value={votingWay}
                onChange={(e) => setVotingWay(parseInt(e.target.value))}
              >
                <FormControlLabel value={0} control={<Radio />} label="Against" />
                <FormControlLabel value={1} control={<Radio />} label="For" />
                <FormControlLabel value={2} control={<Radio />} label="Abstain" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            {votingWay < 3 && (
              <Button>
                Vote
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Container>

  )
}

export default ProposalPage;