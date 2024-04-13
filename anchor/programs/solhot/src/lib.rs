use anchor_lang::prelude::*;

declare_id!("7hgP3DN1LsuaoHJEJ81iwqcHA6e4tsN2QdS5JFYdDUkn");

#[program]
pub mod solhot {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
