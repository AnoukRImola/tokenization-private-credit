use soroban_sdk::contracttype;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    EscrowContract,
    ParticipationToken,
}
