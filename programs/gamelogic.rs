use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("SorcererPool111111111111111111111111111111111111");

#[program]
pub mod sorcerers_cue {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, _game_id: u64) -> Result<()> {
        let game_account = &mut ctx.accounts.game_account;
        game_account.player1 = ctx.accounts.player1.key();
        game_account.player2 = None;  // Player 2 joins later
        game_account.state = GameState::WaitingForPlayer;
        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>, game_id: u64) -> Result<()> {
        let game_account = &mut ctx.accounts.game_account;
        require!(game_account.state == GameState::WaitingForPlayer, CustomError::GameAlreadyStarted);
        game_account.player2 = Some(ctx.accounts.player2.key());
        game_account.state = GameState::InProgress;
        Ok(())
    }

    pub fn take_shot(ctx: Context<TakeShot>, shot_power: u8, shot_angle: u16) -> Result<()> {
        let game_account = &mut ctx.accounts.game_account;
        let player = &ctx.accounts.player;
        
        // Ensure game is active and player is allowed to take a shot
        require!(game_account.state == GameState::InProgress, CustomError::InvalidGameState);
        require!(game_account.player1 == player.key() || game_account.player2.unwrap() == player.key(), CustomError::InvalidPlayer);

        // Calculate shot results using VRF (Verifiable Random Function)
        let shot_result = calculate_shot(shot_power, shot_angle)?;

        // Update game state (this could include ball positions, pocketed balls, etc.)
        game_account.update_ball_positions(shot_result);

        // Check if game is won
        if game_account.is_won() {
            game_account.state = GameState::Finished;
        }

        Ok(())
    }

    pub fn end_game(ctx: Context<EndGame>) -> Result<()> {
        let game_account = &mut ctx.accounts.game_account;

        // Distribute rewards based on winner and game state
        if game_account.state == GameState::Finished {
            let winner = game_account.get_winner();
            distribute_rewards(ctx, winner)?;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = player1, space = 8 + 64)]
    pub game_account: Account<'info, Game>,
    #[account(mut)]
    pub player1: Signer<'info>,
    #[account("token_program.key == &token::ID")]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut, has_one = player1)]
    pub game_account: Account<'info, Game>,
    #[account(mut)]
    pub player2: Signer<'info>,
}

#[derive(Accounts)]
pub struct TakeShot<'info> {
    #[account(mut, has_one = player1)]
    pub game_account: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndGame<'info> {
    #[account(mut)]
    pub game_account: Account<'info, Game>,
}

#[account]
pub struct Game {
    pub player1: Pubkey,
    pub player2: Option<Pubkey>,
    pub state: GameState,
    pub ball_positions: Vec<(u8, u8)>, // Simplified ball positions
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameState {
    WaitingForPlayer,
    InProgress,
    Finished,
}

#[error_code]
pub enum CustomError {
    #[msg("Game has already started.")]
    GameAlreadyStarted,
    #[msg("Invalid player.")]
    InvalidPlayer,
    #[msg("Invalid game state.")]
    InvalidGameState,
}

fn calculate_shot(shot_power: u8, shot_angle: u16) -> Result<ShotResult> {
    // Use VRF for randomness
    // Simplified shot logic
    Ok(ShotResult { ball_positions: vec![(1, 2), (2, 3)] })  // Placeholder
}

fn distribute_rewards(ctx: &Context<EndGame>, winner: Pubkey) -> Result<()> {
    // Logic for transferring tokens or NFTs to winner
    Ok(())
}
