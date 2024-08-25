import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "./constants/index";
import './App.css'
import CryptoDevImg from './assets/crypto-devs.svg'

export default function WhitelistDapp() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };
    
    const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
  } catch (err) {
    console.error(err);
  }
};

const renderButton = () => {
  if (walletConnected) {
    if (joinedWhitelist) {
      return (
        <div>
          Thanks for joining the Whitelist!
        </div>
      );
    } else if (loading) {
      return <button className="button">Loading...</button>;
    } else {
      return (
        <button onClick={addAddressToWhitelist} className="button">
          Join the Whitelist
        </button>
      );
    }
  } else {
    return (
      <button 
      onClick={()=>{
        connectWallet()
      }}  
      className="button connect-wallet-btn">
        Connect your wallet
      </button>
    );
  }
};

useEffect(() => {
if (!walletConnected) {
  web3ModalRef.current = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false,
  });
  // connectWallet();
}
}, [walletConnected]);

return (
<div>
<div>
<title>Whitelist Dapp</title>
<meta name="description" content="Whitelist-Dapp" />
<link rel="icon" href="/favicon.ico" />
</div>
<main className="main-container">
<div className="main">
<h1>Welcome to Crypto Devs!</h1>
<p>
It's an NFT collection for developers in Crypto.
</p>
<div>
{numberOfWhitelisted} have already joined the Whitelist
</div>
{renderButton()}

</div>
<div>
<img src={CryptoDevImg} alt="Crypto Devs" className="cryptoimg" />
</div>
  </main>
<footer>
Made with ❤ by Crypto Devs
</footer>
</div>
);
}

