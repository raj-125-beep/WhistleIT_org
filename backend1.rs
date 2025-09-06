use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere");

#[program]
pub mod case_portal {
    use super::*;
    
    pub fn submit_case(ctx: Context<SubmitCase>, title: String, category: String, description: String) -> Result<()> {
        let case = &mut ctx.accounts.case;
        case.title = title;
        case.category = category;
        case.description = description;
        case.submitter = *ctx.accounts.user.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SubmitCase<'info> {
    #[account(init, payer = user, space = 8 + 32 + 64 + 64 + 256)]
    pub case: Account<'info, Case>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Case {
    pub submitter: Pubkey,
    pub title: String,
    pub category: String,
    pub description: String,
}
