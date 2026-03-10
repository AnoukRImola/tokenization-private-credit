use soroban_sdk::{Address, Env, IntoVal, Symbol, Val, contract, contractimpl, token, vec};
use token::Client as TokenClient;

#[contract]
pub struct ParticipationTokenContract;

#[derive(Clone)]
pub struct Config {
    pub escrow_contract: Address,
    pub participation_token: Address,
}

fn read_config(e: &Env) -> Config {
    let escrow_key: Val = "escrow".into_val(e);
    let token_key: Val = "token".into_val(e);

    let escrow_contract: Address = e
        .storage()
        .instance()
        .get(&escrow_key)
        .unwrap();
    let participation_token: Address = e
        .storage()
        .instance()
        .get(&token_key)
        .unwrap();
    Config {
        escrow_contract,
        participation_token,
    }
}

fn write_config(e: &Env, escrow_contract: &Address, participation_token: &Address) {
    let escrow_key: Val = "escrow".into_val(e);
    let token_key: Val = "token".into_val(e);

    e.storage().instance().set(&escrow_key, escrow_contract);
    e.storage().instance().set(&token_key, participation_token);
}

#[contractimpl]
impl ParticipationTokenContract {
    pub fn __constructor(env: Env, escrow_contract: Address, participation_token: Address) {
        write_config(&env, &escrow_contract, &participation_token);
    }

    pub fn buy(env: Env, usdc: Address, payer: Address, beneficiary: Address, amount: i128) {
        payer.require_auth();

        let cfg = read_config(&env);

        let usdc_client = TokenClient::new(&env, &usdc);
        usdc_client.transfer(&payer, &cfg.escrow_contract, &amount);

        let mint_sym = Symbol::new(&env, "mint");
        let args_vec = vec![&env, beneficiary.into_val(&env), amount.into_val(&env)];

        let _: () = env.invoke_contract(&cfg.participation_token, &mint_sym, args_vec);
    }
}
