use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    EscrowContractNotFound = 1,
    ParticipationTokenNotFound = 2,
    AdminNotFound = 3,
    OnlyAdminCanSetToken = 4,
}
