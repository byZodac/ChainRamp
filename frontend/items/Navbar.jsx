import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Navbar = ({ onConnect, isConnected }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalanceWalletIcon sx={{ mr: 3 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChainRamp
        </Typography>
        <Button 
          sx={{ 
            color: 'variant', 
            backgroundColor: 'white', 
            fontWeight: 'bold', 
            '&:hover': {
              backgroundColor: 'lightgray',
              fontWeight: 'bold', 
            },
          }} 
          onClick={onConnect}
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
