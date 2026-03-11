use soroban_sdk::contracterror;

#[derive(Debug, Copy, Clone, PartialEq)]
#[contracterror]
pub enum ContractError {
    AdminNotFound = 1,
    OnlyAdminCanChangeAvailability = 2,
    ExchangeIsCurrentlyDisabled = 3,
    BeneficiaryHasNoTokensToClaim = 4,
    VaultDoesNotHaveEnoughUSDC = 5,
    ArithmeticOverflow = 6,
    NotInitialized = 7,
}