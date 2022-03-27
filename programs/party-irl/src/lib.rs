use anchor_lang::prelude::*;

declare_id!("XxFzjuDV8dptxFvY5v4AzQZk9j8h8Afpoi8WNU6uVtq");

#[program]
pub mod party_irl {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
