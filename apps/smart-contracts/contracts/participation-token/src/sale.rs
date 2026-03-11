use soroban_sdk::{contract, contractimpl, token, Address, Env, IntoVal, Symbol, vec};
use token::Client as TokenClient;

use crate::error::ContractError;
use crate::events::BuyEvent;
use crate::storage_types::{DataKey, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD};

#[contract]
pub struct ParticipationTokenContract;

#[derive(Clone)]
pub struct Config {
    pub escrow_contract: Address,
    pub participation_token: Address,
    pub usdc_address: Address,
}

fn read_config(e: &Env) -> Result<Config, ContractError> {
    let escrow_contract: Address = e
        .storage()
        .instance()
        .get(&DataKey::EscrowContract)
        .ok_or(ContractError::NotInitialized)?;
    let participation_token: Address = e
        .storage()
        .instance()
        .get(&DataKey::ParticipationToken)
        .ok_or(ContractError::NotInitialized)?;
    let usdc_address: Address = e
        .storage()
        .instance()
        .get(&DataKey::UsdcAddress)
        .ok_or(ContractError::NotInitialized)?;
    Ok(Config {
        escrow_contract,
        participation_token,
        usdc_address,
    })
}

fn write_config(
    e: &Env,
    escrow_contract: &Address,
    participation_token: &Address,
    usdc_address: &Address,
) {
    e.storage()
        .instance()
        .set(&DataKey::EscrowContract, escrow_contract);
    e.storage()
        .instance()
        .set(&DataKey::ParticipationToken, participation_token);
    e.storage()
        .instance()
        .set(&DataKey::UsdcAddress, usdc_address);
}

/// Invokes the `mint(to, amount)` function on the token-factory contract.
/// Uses `invoke_contract` because `mint` is a custom method not part of
/// the standard Soroban `TokenInterface`, so `token::Client` cannot be used.
fn mint_participation_tokens(env: &Env, token_contract: &Address, to: &Address, amount: i128) {
    let mint_fn = Symbol::new(env, "mint");
    let args = vec![env, to.into_val(env), amount.into_val(env)];
    let _: () = env.invoke_contract(token_contract, &mint_fn, args);
}

#[contractimpl]
impl ParticipationTokenContract {
    pub fn __constructor(
        env: Env,
        escrow_contract: Address,
        participation_token: Address,
        usdc_address: Address,
    ) {
        write_config(&env, &escrow_contract, &participation_token, &usdc_address);
    }

    pub fn buy(
        env: Env,
        payer: Address,
        beneficiary: Address,
        amount: i128,
    ) -> Result<(), ContractError> {
        payer.require_auth();

        if amount <= 0 {
            return Err(ContractError::AmountMustBePositive);
        }

        // Extend TTL to prevent storage expiration
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);

        let cfg = read_config(&env)?;

        // Transfer USDC from payer to escrow
        let usdc_client = TokenClient::new(&env, &cfg.usdc_address);
        usdc_client.transfer(&payer, &cfg.escrow_contract, &amount);

        // Mint participation tokens to beneficiary
        mint_participation_tokens(&env, &cfg.participation_token, &beneficiary, amount);

        BuyEvent {
            payer,
            beneficiary,
            amount,
        }
        .publish(&env);

        Ok(())
    }
}
