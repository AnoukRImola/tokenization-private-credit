use soroban_sdk::contracterror;

#[derive(Debug, Copy, Clone, PartialEq)]
#[contracterror]
pub enum ContractError {
    NotInitialized = 1,
    AmountMustBePositive = 2,
}
