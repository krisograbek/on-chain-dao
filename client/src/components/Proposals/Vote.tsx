import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';


type Props = {
  color: string,
  votingWay: number,
  setVotingWay: React.Dispatch<React.SetStateAction<number>>,
  reason: string,
  setReason: React.Dispatch<React.SetStateAction<string>>,
  vote: Function,
  proposalId: string
}

const Vote = ({ color, votingWay, setVotingWay, reason, setReason, vote, proposalId }: Props) => {



  return <Grid item sm={12} sx={{ py: 5 }}>
    <Grid container>
      <Grid item sm={12} md={8}>
        <Typography variant='h3' color={color}>Voting is Active</Typography>
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
            onChange={e => setReason(e.target.value)} />
        </Box>
      </Grid>
      <Grid item sm={12}>
        {votingWay < 3 && (
          <Button variant='contained' onClick={e => vote(proposalId, votingWay, reason)}>
            Vote
          </Button>
        )}
      </Grid>
    </Grid>
  </Grid>;
};

export default Vote;
