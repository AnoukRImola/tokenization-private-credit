use soroban_sdk::{contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug)]
pub struct BuyEvent {
    pub payer: Address,
    pub beneficiary: Address,
    pub amount: i128,
    pub usdc: Address,
}

pub fn emit_buy(env: &Env, event: BuyEvent) {
    env.events().publish(("ParticipationToken", "buy"), event);
}
