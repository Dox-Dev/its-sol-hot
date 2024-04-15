"use client";
import { useState, useEffect } from "react";
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
import { faUser, faWallet, faArrowsRotate, faPlus} from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faWallet, faArrowsRotate, faPlus);

import {Card, CardFooter, Image, Button} from "@nextui-org/react";

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
    const SolhotDapp = getSolhot(getAnchorProvider()); // call function, which requires the anchorProvider
    const keypair = web3.Keypair.generate(); // the keypair is the post
    try {
      const signature = await SolhotDapp.methods
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
  

  // Solhot_IDL = what are the instructions, what are the account structures
  // PublicKey = so that we know which account we want to focus on
  // provider = optional, BUT we use this so we don't have to expose our private key
  function getSolhot(provider: AnchorProvider) {
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
    const SolhotDapp = getSolhot(anchorProvider);
    try {
      const temp = await SolhotDapp.account.record.all();
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

  // for listening to screen size changes
  const SMALL_WINDOW_SIZE_IN_PX = 640;
  const [isSmallDesktop, setSmallDesktop] = useState(window.innerWidth > SMALL_WINDOW_SIZE_IN_PX);

  const updateMedia = () => {
    setSmallDesktop(SMALL_WINDOW_SIZE_IN_PX <= window.innerWidth && window.innerWidth < 1050);
  };

  // listener for when you resize the window
  useEffect(() => {
	console.log("window.innerWidth " + window.innerWidth);
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

		{ // Upper part (Question Header, Connect Wallet, Refresh, Slider, Create Post)
		window.innerWidth > SMALL_WINDOW_SIZE_IN_PX? (
		<div id="top-elements-PARENT">
			<div className="grid grid-rows-4 grid-flow-col max-w-2xl">
				<div className="row-span-2 text-5xl">
					So... how hot is it for you right now?
				</div>
				<div className="row-span-1 col-span-2">
					<Slider size="lg"
    				  		step={1}
    				  		color="foreground"
    				  		label="Temperature"
    				  		showSteps={false} 
    				  		minValue={0}
    				  		maxValue={50}
							getValue={(temperature) => `${temperature} °C`}
    				  		defaultValue={1}
    				  		className=""
							onChangeEnd={handleSliderChange} />
				</div>
				<div className="row-span-1 col-span-2">
					<Button onClick={onCreatePost} 
							className="w-full bg-green-400 dark:bg-green-700" 
							startContent={<FontAwesomeIcon 
							icon={faPlus} />}>
								Create Post
					</Button>
				</div>
				<div className="col-span-1 self-start">
				<Button onClick={onConnectWallet} 
						className="bg-purple-400 dark:bg-purple-700 text-black/90 dark:text-white/90 items-center" 
						startContent={<FontAwesomeIcon 
						icon={faWallet} />}>
    			  	{connectedWallet? 
						`${connectedWallet.slice(0,4)}...${connectedWallet.slice(-4)}` : 
						"Connect Wallet"
					}
    			</Button>  
				</div>
				<div className="col-span-1 self-start">
    				{ // by doing it like this, we can shortcircuit the button to only appear once the wallet is connected via connectedWallet
						connectedWallet && 
						<div>
							<Button onClick={onGetPosts} className="bg-indigo-400 dark:bg-indigo-700" startContent={<FontAwesomeIcon icon={faArrowsRotate} />}>Refresh</Button>
						</div>
					}
				</div>
			</div>
		</div>
		): (
		<div id="bottom-elements-PARENT">
			<div className="grid grid-col-2 grid-flow-row gap-4 max-w-2xl">

				<div className="col-span-2 text-6xl">
					So... how hot is it for you right now?
				</div>

				<div className="col-span-1 self-center">
					<Button onClick={onConnectWallet} 
							className="bg-purple-400 dark:bg-purple-700 text-black/90 dark:text-white/90 w-full" 
							startContent={<FontAwesomeIcon 
							icon={faWallet} />}>
						{connectedWallet? 
							`${connectedWallet.slice(0,4)}...${connectedWallet.slice(-4)}` : 
							"Connect Wallet"
						}
					</Button>  
				</div>

				<div className="col-span-1">
				{ // by doing it like this, we can shortcircuit the button to only appear once the wallet is connected via connectedWallet
				  	connectedWallet && 
				  	<div>
						<Button onClick={onGetPosts} className="w-full bg-indigo-400 dark:bg-indigo-700" startContent={<FontAwesomeIcon icon={faArrowsRotate} />}>Refresh</Button>
					</div>
				}
				</div>
			  	<div className="col-span-2">
			  	<Slider size="lg"
						step={1}
						color="foreground"
						label="Temperature"
						showSteps={false} 
						minValue={0}
						maxValue={50}
					  	getValue={(temperature) => `${temperature} °C`}
						defaultValue={1}
						className=""
					  	onChangeEnd={handleSliderChange} />
			  	</div>
			  	<div className="row-span-1 col-span-2">
					<Button onClick={onCreatePost} 
							className="w-full bg-green-400 dark:bg-green-700" 
							startContent={<FontAwesomeIcon 
							icon={faPlus} />}>
								Create Post
					</Button>
				</div>
			</div>
							
			</div>
		)}

		{ /* Bottom part (grid of Records) */ }
		<div className="grid grid-cols-2 sm:grid-cols-4  grid-flow-row gap-4">
    	{records.map((e: any) => {
    	  return (
    	    <div key={e.publicKey.toString()}>
				{
				<Card
    			  isFooterBlurred
    			  radius="lg"
    			  className="border-none my-2"
    			>
					{
    			  <Image
    			    alt="Woman listing to music"
    			    className="object-cover"
    			    height={200}
    			    src={`https://api.dicebear.com/8.x/identicon/svg?seed=${e.publicKey.toString()}`} //"/images/hero-card.jpeg"
    			    width={200}
    			  />
					}
    			  <CardFooter className="justify-between before:bg-white/10 border-black/20 dark:border-white/20  border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
    			    <p className="text-tiny text-black/80 dark:text-white/80">{e.account.temperature} °C</p>
					<a href={'https://explorer.solana.com/address/' + e.publicKey.toString() + '?cluster=devnet'} target="_blank">
						{isSmallDesktop? (
    			    		<Button className="text-tiny bg-white/20 dark:bg-black/20" variant="flat" color="default" radius="lg" size="sm">
    			    		  	Details
    			    		</Button>
						) : (
							<Button className="text-tiny bg-white/20 dark:bg-black/20" variant="flat" color="default" radius="lg" size="sm">
    			    	  		Account Details
    			    		</Button>
						)}
					</a>
    			  </CardFooter>
    			</Card>
				}
    	    </div>
    	  );
    	})}
		</div>
    </main>
  );
}