import React, { MouseEventHandler, useContext } from 'react'
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/helpers';
import { AppContext } from '../context/AppContext';
import Grid from '@mui/material/Grid';

type Props = {
  boxValue: number,
  accounts: Array<string>,
  accountId: number,
  setAccountId: Function,
  availableTokens: number,
  connectWallet: MouseEventHandler<HTMLButtonElement>,
  user: string
}

const Navbar = ({ boxValue, accounts, accountId, setAccountId, availableTokens, connectWallet, user }: Props) => {

  const { isLocalDev } = useContext(AppContext);

  const handleAccountChange = (e: SelectChangeEvent<number>) => {
    setAccountId(e.target.value);
  }

  return (
    <AppBar position='static' color='inherit' sx={{ py: 1 }}>
      <Toolbar>
        <Button size='large'>
          <Link to="/">Home</Link>
        </Button>
        <Button size='large'>
          <Link to="/proposals">Proposals</Link>
        </Button>
        {/* <Button variant="contained" onClick={onClick}>
          Get Proposals
        </Button> */}
        <Typography sx={{ flexGrow: 1 }}>Box value: {boxValue}</Typography>
        {/* <Grid item></Grid> */}
        {user && (
          <>
            <Typography sx={{ px: 2 }}>You own {availableTokens} tokens </Typography>
            <Typography sx={{ px: 2 }}>Account: {shortenAddress(user)}</Typography>
          </>
        )
        }
        {isLocalDev ? (
          <FormControl variant="standard" sx={{ px: 3, m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label" sx={{ px: 3, m: 1, minWidth: 120 }}>Account</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={accountId}
              onChange={e => handleAccountChange(e)}
            >
              <MenuItem value={0}>{shortenAddress(accounts[0])}</MenuItem>
              <MenuItem value={1}>{shortenAddress(accounts[1])}</MenuItem>
              <MenuItem value={2}>{shortenAddress(accounts[2])}</MenuItem>
            </Select>
          </FormControl>
        ) : (
          !user && (
            <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
          )
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar