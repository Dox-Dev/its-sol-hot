import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solhot } from "../target/types/solhot";

describe("solhot", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();
  const program = anchor.workspace.Solhot as Program<Solhot>;

  it("Is initialized!", async () => {
    const postKeypair = anchor.web3.Keypair.generate();
    // Add your test here.
    const tx = await program.methods
    .initialize(1) // the message that's going to be put in the post account
    .accounts({ 
      payer: provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      record: postKeypair.publicKey,
    })
    .signers([postKeypair])  // synonymous to payers
                  // when instantiating provider, your wallets are already in that provider (Phantom Wallet)
                  // IMPORTANT: So we put the secret key/keypair for the mint to GIVE CONSENT for the transaction
                  //            Hindi basta-basta papayag.
    .rpc();
    console.log("Your transaction signature", tx);
  });
});