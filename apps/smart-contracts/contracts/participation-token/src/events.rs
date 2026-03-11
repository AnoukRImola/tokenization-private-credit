use soroban_sdk::{contractevent, Address};

#[contractevent(topics = ["pt_buy"], data_format = "vec")]
#[derive(Clone, Debug)]
pub struct BuyEvent {
    pub payer: Address,
    pub beneficiary: Address,
    pub amount: i128,
}
