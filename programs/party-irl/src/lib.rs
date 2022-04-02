use anchor_lang::prelude::*;

declare_id!("XxFzjuDV8dptxFvY5v4AzQZk9j8h8Afpoi8WNU6uVtq");

#[program]
pub mod party_irl {
    use super::*;

    pub fn create_party(
        ctx: Context<CreateParty>,
        name: String,
        maximum_guests: u32,
        party_at: i64,
        check_in_ends_at: i64,
        stake_in_lamports: u64,
    ) -> Result<()> {
        let party: &mut Account<Party> = &mut ctx.accounts.party;
        let creator: &Signer = &ctx.accounts.creator;
        let clock: Clock = Clock::get().unwrap();

        // Validations 
        if name.chars().count() > 64 {
            return Err(ErrorCode::PartyNameTooLong.into())
        }
        if party_at < clock.unix_timestamp {
            return Err(ErrorCode::PartyAtInThePast.into())
        }
        if check_in_ends_at - party_at < 5 * 60 {
            return Err(ErrorCode::CheckInTimeTooShort.into())
        }

        party.creator = *creator.key;
        party.name = name;
        party.party_at = party_at;
        party.check_in_ends_at = check_in_ends_at;
        party.stake_in_lamports = stake_in_lamports;
        party.maximum_guests = maximum_guests;

        party.added_guests_count = 0;
        party.checked_in_guests_count = 0;

        Ok(())
    }

    pub fn add_guest(
        ctx: Context<AddGuest>,
    ) -> Result<()> {
        let guest: &mut Account<Guest> = &mut ctx.accounts.guest;
        let party: &mut Account<Party> = &mut ctx.accounts.party;
        let guest_authority: &Signer = &ctx.accounts.guest_authority;
        let clock: Clock = Clock::get().unwrap();

        if party.check_in_ends_at < clock.unix_timestamp {
            return Err(ErrorCode::CheckInNotOpen.into())
        }
        if party.added_guests_count >= party.maximum_guests {
            return Err(ErrorCode::PartyFull.into())
        }

        let add_guest_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &guest_authority.key(),
            &party.key(),
            party.stake_in_lamports,
        );
        anchor_lang::solana_program::program::invoke(
            &add_guest_transfer,
            &[
                guest_authority.to_account_info(),
                party.to_account_info(),
            ],
        )?;

        guest.guest_authority = *guest_authority.key;
        guest.party = party.key();
        guest.has_checked_in = false;
        guest.has_settled_stake = false;
        guest.bump = *ctx.bumps.get("guest").unwrap();

        party.added_guests_count += 1;

        Ok(())
    }

    pub fn check_in_guest(
        ctx: Context<CheckInGuest>,
    ) -> Result<()> {
        let guest: &mut Account<Guest> = &mut ctx.accounts.guest;
        let party: &mut Account<Party> = &mut ctx.accounts.party;
        let clock: Clock = Clock::get().unwrap();

        if party.party_at > clock.unix_timestamp {
            return Err(ErrorCode::CheckInNotOpen.into())
        }
        if party.check_in_ends_at < clock.unix_timestamp {
            return Err(ErrorCode::CheckInNotOpen.into())
        }
        if guest.has_checked_in {
            return Err(ErrorCode::AlreadyCheckedIn.into())
        }

        guest.has_checked_in = true;

        party.checked_in_guests_count += 1;

        Ok(())
    }

    pub fn settle_guest(
        ctx: Context<SettleGuest>,
    ) -> Result<()> {
        let guest: &mut Account<Guest> = &mut ctx.accounts.guest;
        let party: &mut Account<Party> = &mut ctx.accounts.party;
        let guest_authority: &Signer = &ctx.accounts.guest_authority;
        let clock: Clock = Clock::get().unwrap();

        if party.check_in_ends_at > clock.unix_timestamp {
            return Err(ErrorCode::TooEarlyToSettle.into())
        }
        if !guest.has_checked_in || guest.has_settled_stake {
            return Err(ErrorCode::CannotSettle.into())
        }

        let settle_amount = (party.stake_in_lamports * party.added_guests_count as u64) / party.checked_in_guests_count as u64;

        **party.to_account_info().lamports.borrow_mut() -= settle_amount;
        **guest_authority.lamports.borrow_mut() += settle_amount;

        guest.has_settled_stake = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateParty<'info> {
    #[account(
        init, 
        payer = creator, 
        space = Party::space(&name),
    )]
    pub party: Account<'info, Party>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGuest<'info> {
    #[account(
        init, 
        payer = guest_authority, 
        space = Guest::LENGTH,
        seeds=[
            b"guest",
            party.to_account_info().key().as_ref(),
            guest_authority.to_account_info().key().as_ref(),
        ],
        bump
    )]
    pub guest: Account<'info, Guest>,
    #[account(mut)]
    pub party: Account<'info, Party>,
    #[account(mut)]
    pub guest_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckInGuest<'info> {
    #[account(
        mut, 
        has_one = guest_authority,
        seeds=[
            b"guest",
            party.to_account_info().key().as_ref(),
            guest_authority.to_account_info().key().as_ref(),
        ],
        bump=guest.bump
    )]
    pub guest: Account<'info, Guest>,
    #[account(mut)]
    pub party: Account<'info, Party>,
    pub guest_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleGuest<'info> {
    #[account(
        mut,
        has_one = guest_authority,
        seeds=[
            b"guest",
            party.to_account_info().key().as_ref(),
            guest_authority.to_account_info().key().as_ref(),
        ],
        bump=guest.bump
    )]
    pub guest: Account<'info, Guest>,
    #[account(mut)]
    pub party: Account<'info, Party>,
    #[account(mut)]
    pub guest_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Party {
    pub creator: Pubkey,
    pub name: String, // max 64 characters
    pub party_at: i64,
    pub check_in_ends_at: i64,
    pub stake_in_lamports: u64,
    pub maximum_guests: u32,
    pub added_guests_count: u32,
    pub checked_in_guests_count: u32,
}

#[account]
pub struct Guest {
    pub bump: u8,
    pub guest_authority: Pubkey,
    pub party: Pubkey,
    pub has_checked_in: bool,
    pub has_settled_stake: bool,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4;
const TIMESTAMP_LENGTH: usize = 8;
const STAKE_IN_LAMPORTS_LENGTH: usize = 8;

impl Party {
    fn space(name: &str) -> usize {
        DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // creator
        + STRING_LENGTH_PREFIX + name.len() // name 
        + TIMESTAMP_LENGTH // party_at
        + TIMESTAMP_LENGTH // check_in_ends_at
        + STAKE_IN_LAMPORTS_LENGTH // stake_in_lamports
        + 4 // maximum_guests
        + 4 // added_guests_count
        + 4 // checked_in_guests_count
    }
}

impl Guest {
    const LENGTH: usize = DISCRIMINATOR_LENGTH 
        + PUBLIC_KEY_LENGTH // party
        + PUBLIC_KEY_LENGTH // guest
        + 1 // has_checked_in
        + 1 // has_settled_stake
        + 1; // bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Party name can't be longer than 64 characters.")]
    PartyNameTooLong,
    #[msg("Party start time can't be in the past.")]
    PartyAtInThePast,
    #[msg("Party is full.")]
    PartyFull,
    #[msg("Check-in time must be longer than 5 minutes.")]
    CheckInTimeTooShort,
    #[msg("Check-in is not open.")]
    CheckInNotOpen,
    #[msg("You have already checked-in.")]
    AlreadyCheckedIn,
    #[msg("Check-in is still open.")]
    TooEarlyToSettle,
    #[msg("You cannot settle.")]
    CannotSettle,
}