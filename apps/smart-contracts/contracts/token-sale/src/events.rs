use soroban_sdk::{contractevent, Address, Env};

#[contractevent(topics = ["pt_buy"], data_format = "vec")]
#[derive(Clone, Debug)]
pub struct BuyEvent {
    pub payer: Address,
    pub beneficiary: Address,
    pub amount: i128,
    pub usdc: Address,
}

pub fn emit_buy(env: &Env, event: BuyEvent) {
    event.publish(env);
}
