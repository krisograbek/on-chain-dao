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
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { shortenAddress, stateEnum, getThemeColor } from '../../utils/helpers';

type Props = {
  proposals: Array<Proposal>,
  vote: Function
}

const ProposalPage = ({ proposals, vote }: Props) => {
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
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item sm={3} textAlign="center">
          <Typography variant='h5' color={color} sx={{ border: 1, p: 1 }}>
            {stateEnum[state]}
          </Typography>
        </Grid>
        <Grid item sm={9} textAlign="right">
          <Typography>
            Proposed By: {shortenAddress(proposer)}
          </Typography>
        </Grid>
        <Grid item sm={12}>
          {stateEnum[state] === "Active" && (
            <Grid container >
              <Grid item sm={12} md={8}>
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
              <Grid item sm={12} md={8}>
                <Box>

                  <TextField
                    sx={{ my: 3 }}
                    name='reason'
                    multiline
                    variant='outlined'
                    label='Explain your decision (Optional)'
                    fullWidth
                    disabled={votingWay > 2}
                    rows={3}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item sm={12}>
                {votingWay < 3 && (
                  <Button variant='contained' onClick={e => vote(proposer, votingWay, reason)}>
                    Vote
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>

  )
}

export default ProposalPage;