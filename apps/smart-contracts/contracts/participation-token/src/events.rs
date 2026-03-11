use soroban_sdk::{contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug)]
pub struct BuyEvent {
    pub payer: Address,
    pub beneficiary: Address,
    pub amount: i128,
}

pub mod events {
    use super::*;
    use soroban_sdk::symbol_short;

    pub fn emit_buy(env: &Env, event: BuyEvent) {
        env.events().publish((symbol_short!("buy"),), event);
    }
}
