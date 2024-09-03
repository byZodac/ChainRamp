import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useWallet } from "../providers/WalletProvider";
const Navbar = () => {
  const { account, connect, isConnecting } = useWallet();
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalanceWalletIcon sx={{ mr: 3 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ChainRamp
        </Typography>
        {/* <ConcordiumWalletConnect /> */}
        {!account ? (
          <Button
            onClick={connect}
            disabled={isConnecting}
            style={{ backgroundColor: "white" }}
          >
            Connect Wallet
          </Button>
        ) : (
          <p>Connected</p>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
