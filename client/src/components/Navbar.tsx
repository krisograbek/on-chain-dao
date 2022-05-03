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
    <AppBar position='static' color='inherit' sx={{ py: 3 }}>
      <Button variant="contained" onClick={onClick}>
        Get Events
      </Button>
    </AppBar>
  )
}

export default Navbar