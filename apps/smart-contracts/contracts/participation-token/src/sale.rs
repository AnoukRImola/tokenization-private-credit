use soroban_sdk::{Address, Env, IntoVal, Symbol, Val, contract, contractimpl, token, vec};
use token::Client as TokenClient;

#[contract]
pub struct ParticipationTokenContract;

#[derive(Clone)]
pub struct Config {
    pub escrow_contract: Address,
    pub token_factory: Address,
}

fn read_config(e: &Env) -> Config {
    let escrow_key: Val = "escrow".into_val(e);
    let factory_key: Val = "token_factory".into_val(e);

    let escrow_contract: Address = e
        .storage()
        .instance()
        .get(&escrow_key)
        .unwrap();

    let token_factory: Address = e
        .storage()
        .instance()
        .get(&factory_key)
        .unwrap();

    Config {
        escrow_contract,
        token_factory,
    }
}

fn write_config(e: &Env, escrow_contract: &Address, token_factory: &Address) {
    let escrow_key: Val = "escrow".into_val(e);
    let factory_key: Val = "token_factory".into_val(e);

    e.storage().instance().set(&escrow_key, escrow_contract);
    e.storage().instance().set(&factory_key, token_factory);
}

#[contractimpl]
impl ParticipationTokenContract {
    pub fn __constructor(env: Env, escrow_contract: Address, token_factory: Address) {
        write_config(&env, &escrow_contract, &token_factory);
    }

    pub fn buy(env: Env, usdc: Address, payer: Address, amount: i128) {
        payer.require_auth();

        let cfg = read_config(&env);

        let usdc_client = TokenClient::new(&env, &usdc);
        usdc_client.transfer(&payer, &cfg.escrow_contract, &amount);

        let mint_sym = Symbol::new(&env, "mint");
        let args_vec = vec![&env, payer.into_val(&env), amount.into_val(&env)];

        let _: () = env.invoke_contract(&cfg.token_factory, &mint_sym, args_vec);
    }
}
