use anchor_lang::prelude::*;

declare_id!("Gg1h1jVE4XN8z3ygbjsvPeTrqMiPnAyrFrJRHaVp4CfM");

#[program]
pub mod solhot {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, temperature: u8) -> Result<()> {
        let record: &mut Account<'_, Record>= &mut ctx.accounts.record;
        record.temperature = temperature;
        Ok(())
    }
}

#[derive(Accounts)]

// executable account (drainer NFTs :<)
// practically everything is an account
// NFT has 3 accounts = wallet account, Associate Token Account (ATA) - PDA, mint account (ID, keypair)
pub struct Initialize<'info> {
    #[account(mut)]                             // account METADATA
    pub payer: Signer<'info>,                   // payer is the one paying for the transaction
    #[account(                                  // PATTERN (that you'll always use): initialize/create a new account, set who pays, how much space is needed to be allocated
        init,                               
        payer = payer,                      
        space = 8 + Record:: INIT_SPACE
    )]
    pub record: Account<'info, Record>,             // account = similar to a table in SQL

    // Note: you can make more accounts under here with
    // #[account(
    //     ...
    // )]
    // pub someStructInstantiation: Account<'info, Record>,

    pub system_program: Program<'info, System>, // don't have to think about system_program, only needed to create accounts
                                                //      not necessarily executable even if it has system_program, 
                                                //      literally system_program is just used for making the account
}


#[account]  // explicitly saying that this is meant for an account
            // makes the program understand that this struct Record 
            // is the structure of an account in your program
#[derive(InitSpace)]    // structure of an account
                        // dictates how much space you need
pub struct Record { // account Record = similar to a table in SQL
    #[max_len(150)]
    pub temperature: u8,
}