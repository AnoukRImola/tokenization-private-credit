use soroban_sdk::contracttype;

#[contracttype]
pub enum DataKey {
    EscrowContract,
    ParticipationToken,
    Admin,
}
