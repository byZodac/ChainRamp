import { useState, useEffect } from "react";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import { Button } from "@mui/material";

const ConcordiumWalletConnect = () => {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = await detectConcordiumProvider();
      setWallet(provider);
    };
    init();
  }, []);

  const connect = async () => {
    if (wallet) {
      try {
        const connectedAccount = await wallet.connect();
        setAccount(connectedAccount);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 7)}...${address.slice(-5)}`;
  };

  return (
    <Button
      sx={{
        color: "variant",
        backgroundColor: "white",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "lightgray",
        },
      }}
      onClick={connect}
    >
      {account ? shortenAddress(account) : "Connect Wallet"}
    </Button>
  );
};

export default ConcordiumWalletConnect;
