import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConcordiumWalletConnect from './WalletConnect';
const Navbar = ({ onConnect, isConnected }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalanceWalletIcon sx={{ mr: 3 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChainRamp
        </Typography>
        <ConcordiumWalletConnect />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

