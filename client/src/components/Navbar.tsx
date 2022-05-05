import React from 'react'
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

type Props = {
  onClick: React.MouseEventHandler
}

const Navbar = ({ onClick }: Props) => {
  return (
    <AppBar position='static' color='inherit' sx={{ py: 1 }}>
      <Toolbar>
        <Typography variant='h4'>
          <Link to="/">Home</Link>
        </Typography>
        {/* <Button variant="contained" onClick={onClick}>
          Get Proposals
        </Button> */}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar