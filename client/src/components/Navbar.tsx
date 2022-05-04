import React from 'react'
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

type Props = {
  onClick: React.MouseEventHandler
}

const Navbar = ({ onClick }: Props) => {
  return (
    <AppBar position='static' color='inherit' sx={{ py: 1 }}>
      <Toolbar>
        <Button variant="contained" onClick={onClick}>
          Get Proposals
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar