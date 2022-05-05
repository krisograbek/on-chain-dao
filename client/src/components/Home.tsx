import React from 'react'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Proposals from './Proposals/Proposals';
import ProposalForm from './Proposals/ProposalForm';

type Props = {
  proposals: any,
  handleSubmit: any
}

const Home = ({ proposals, handleSubmit }: Props) => {
  return (
    <Container maxWidth='lg' sx={{ mt: 5 }}>
      <Grid container className="App" spacing={2}>
        <Grid item sm={12} md={8}>
          <Proposals proposals={proposals} />
        </Grid>
        <Grid item sm={12} md={4}>
          <ProposalForm handleSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home;