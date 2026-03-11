use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, IntoVal, Symbol, vec};
use token::Client as TokenClient;

use crate::error::ContractError;
use crate::storage_types::DataKey;

#[contract]
pub struct ParticipationTokenContract;

#[derive(Clone)]
pub struct Config {
    pub escrow_contract: Address,
    pub participation_token: Address,
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
    Ok(Config {
        escrow_contract,
        participation_token,
    })
}

fn write_config(e: &Env, escrow_contract: &Address, participation_token: &Address) {
    e.storage()
        .instance()
        .set(&DataKey::EscrowContract, escrow_contract);
    e.storage()
        .instance()
        .set(&DataKey::ParticipationToken, participation_token);
}

#[contractimpl]
impl ParticipationTokenContract {
    pub fn __constructor(env: Env, escrow_contract: Address, participation_token: Address) {
        write_config(&env, &escrow_contract, &participation_token);
    }

    pub fn buy(
        env: Env,
        usdc: Address,
        payer: Address,
        beneficiary: Address,
        amount: i128,
    ) -> Result<(), ContractError> {
        payer.require_auth();

        if amount <= 0 {
            return Err(ContractError::AmountMustBePositive);
        }

        let cfg = read_config(&env)?;

        let usdc_client = TokenClient::new(&env, &usdc);
        usdc_client.transfer(&payer, &cfg.escrow_contract, &amount);

        let mint_sym = Symbol::new(&env, "mint");
        let args_vec = vec![&env, beneficiary.into_val(&env), amount.into_val(&env)];

        let _: () = env.invoke_contract(&cfg.participation_token, &mint_sym, args_vec);

        env.events().publish(
            (symbol_short!("buy"),),
            (payer, beneficiary, amount),
        );

        Ok(())
    }
}
