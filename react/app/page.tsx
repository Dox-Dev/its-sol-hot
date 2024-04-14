"use client";
import { useState } from "react";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";

// import type of account, its IDL (similar to ABI in Arbitrum), 
// and metadata (which contains the account's deployed address)
import type {Solhot} from "../../anchor/target/types/solhot";
const Solhot_IDL: Solhot = require('../../anchor/target/idl/solhot.json');

import {metadata} from "../../anchor/target/idl/solhot.json";
const PUBLIC_ACCOUNT_ADDRESS = metadata.address;

import {Slider} from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
library.add(faUser);


export default function Home() {
  const [connectedWallet, setconnectedWallet] = useState<null | string>(null);
  const [records, setrecords] = useState<any[]>([]);
  const [temperature, settemperature] = useState<number>(0);
  const getProvider = () => { // gets instance of wallet from Phantom
    const { 
      phantom: { solana },
    } = window as any;
    return solana;
  };
  const handleChange = (e: any) => {  // just React things
    const { value } = e.target;       // getting the data from the input
    settemperature(value);
  };
  
  // procs when button is clicked
  const onCreatePost = async () => {
    const anchorProvider = getAnchorProvider(); // signs transactions
    const anoniDapp = getSolHot(getAnchorProvider()); // call function, which requires the anchorProvider
    const keypair = web3.Keypair.generate(); // the keypair is the post
    try {
      const signature = await anoniDapp.methods
        .initialize(temperature)
        .accounts({
          record: keypair.publicKey,
          payer: anchorProvider.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([keypair]) // the keypair is the post, we own the post, therefore we can sign the txn
        .rpc();
      settemperature(0); // clear the content
      alert(signature);
    } catch (e) {
      alert(e);
    }
  };
  

  // DubiDapp_IDL = what are the instructions, what are the account structures
  // PublicKey = so that we know which account we want to focus on
  // provider = optional, BUT we use this so we don't have to expose our private key
  function getSolHot(provider: AnchorProvider) {
	console.log(PUBLIC_ACCOUNT_ADDRESS);
    return new Program<Solhot>(
      Solhot_IDL,
      new web3.PublicKey(PUBLIC_ACCOUNT_ADDRESS),
      provider
    );
  }

  // less abstracted; gets provider but on steroids
  // they're the ones who will be in charge of the connection
  // provider here is a means for signing transactions
  // Phantom provider is the one providing the txn, all you need to do is approve.
  // This is so you don't have to expose your private key.
  const getAnchorProvider = () => {
    const provider = getProvider();
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    return new AnchorProvider(connection, provider, {});
  };


  const onGetPosts = async () => {
    const anchorProvider = getAnchorProvider();
    const anoniDapp = getSolHot(anchorProvider);
    try {
      const temp = await anoniDapp.account.record.all();
      setrecords(temp);
    } catch (e) {
      alert(e);
    }
  };

  const onConnectWallet = async () => {
    const provider = getProvider();

    try {
      const resp = await provider.connect();
      setconnectedWallet(resp.publicKey.toString());
    } catch (e) {
      alert(e);
    }
  };
  
  const handleSliderChange = (value: any) => {  // just React things
	if(typeof value == "number") {
    	settemperature(value);
		console.log(`Set temperature to be ${value} °C`);
	}
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={onConnectWallet} className="text-xs">
        {connectedWallet ? connectedWallet : "Connect Wallet"}
      </button>
      {connectedWallet && <button onClick={onGetPosts}>Refresh</button>}
      { //<input type="text" className="text-black" onChange={handleChange} value={temperature} />
	  }

	  <Slider   
        size="sm"
        step={1}
        color="foreground"
        label="Temperature"
        showSteps={true} 
        minValue={0}
        maxValue={50}
		getValue={(temperature) => `${temperature} °C`}
        defaultValue={1}
        className="max-w-md"
		onChangeEnd={handleSliderChange}
      />
	  
      <button onClick={onCreatePost}>Create Post</button>

      {records.map((e: any) => {
        return (
          <div
            key={e.publicKey.toString()}
            className="bg-slate-900 p-5 rounded-lg flex flex-col gap-3"
          >
            <p className="text-xs">{e.publicKey.toString()}</p>
            <p>{e.account.content}</p>
          </div>
        );
      })}
    </main>
  );
}