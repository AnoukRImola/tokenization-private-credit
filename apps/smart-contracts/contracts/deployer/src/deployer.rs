use soroban_sdk::{
    contract, contractimpl, contracttype, Address, BytesN, Env, IntoVal, String, Symbol, Val, Vec,
    vec,
};

use crate::storage_types::DataKey;

/// Result of deploying the full contract suite.
#[derive(Clone, Debug)]
#[contracttype]
pub struct DeployedContracts {
    pub token_factory: Address,
    pub participation_token: Address,
    pub vault_contract: Address,
}

/// Parameters for deploying the full contract suite.
#[derive(Clone, Debug)]
#[contracttype]
pub struct DeployAllParams {
    pub token_salt: BytesN<32>,
    pub participation_salt: BytesN<32>,
    pub vault_salt: BytesN<32>,
    pub token_name: String,
    pub token_symbol: String,
    pub escrow_id: String,
    pub decimal: u32,
    pub escrow_contract: Address,
    pub vault_admin: Address,
    pub vault_enabled: bool,
    pub roi_percentage: i128,
    pub usdc: Address,
}

#[contract]
pub struct DeployerContract;

#[contractimpl]
impl DeployerContract {
    /// Initializes the deployer factory with the admin and WASM hashes
    /// of the contracts it will deploy.
    ///
    /// # Arguments
    /// * `admin` - The deployer admin address
    /// * `token_factory_wasm` - WASM hash for the token-factory contract
    /// * `participation_token_wasm` - WASM hash for the participation-token contract
    /// * `vault_contract_wasm` - WASM hash for the vault-contract contract
    pub fn __constructor(
        env: Env,
        admin: Address,
        token_factory_wasm: BytesN<32>,
        participation_token_wasm: BytesN<32>,
        vault_contract_wasm: BytesN<32>,
    ) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::TokenFactoryWasm, &token_factory_wasm);
        env.storage()
            .instance()
            .set(&DataKey::ParticipationTokenWasm, &participation_token_wasm);
        env.storage()
            .instance()
            .set(&DataKey::VaultContractWasm, &vault_contract_wasm);
    }

    // ============ Individual Deploy Functions ============

    /// Deploys a new token-factory (soroban-token-contract) instance.
    ///
    /// # Arguments
    /// * `salt` - Unique salt for deterministic address derivation
    /// * `name` - Token name
    /// * `symbol` - Token symbol
    /// * `escrow_id` - Escrow contract ID (immutable after init)
    /// * `decimal` - Token decimals (max 18)
    /// * `mint_authority` - Address authorized to mint tokens
    pub fn deploy_token_factory(
        env: Env,
        salt: BytesN<32>,
        name: String,
        symbol: String,
        escrow_id: String,
        decimal: u32,
        mint_authority: Address,
    ) -> Address {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::TokenFactoryWasm)
            .unwrap();

        let constructor_args: Vec<Val> = (
            name,
            symbol,
            escrow_id,
            decimal,
            mint_authority,
        )
            .into_val(&env);

        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    /// Deploys a new participation-token contract instance.
    ///
    /// # Arguments
    /// * `salt` - Unique salt for deterministic address derivation
    /// * `escrow_contract` - The escrow contract address to receive USDC
    /// * `participation_token` - The token-factory address for minting tokens
    pub fn deploy_participation_token(
        env: Env,
        salt: BytesN<32>,
        escrow_contract: Address,
        participation_token: Address,
    ) -> Address {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::ParticipationTokenWasm)
            .unwrap();

        let constructor_args: Vec<Val> = (escrow_contract, participation_token).into_val(&env);

        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    /// Deploys a new vault-contract instance.
    ///
    /// # Arguments
    /// * `salt` - Unique salt for deterministic address derivation
    /// * `vault_admin` - The admin address for the vault
    /// * `enabled` - Initial enabled state for claiming
    /// * `roi_percentage` - ROI percentage (e.g., 5 for 5%)
    /// * `token` - The participation token address
    /// * `usdc` - The USDC stablecoin contract address
    pub fn deploy_vault_contract(
        env: Env,
        salt: BytesN<32>,
        vault_admin: Address,
        enabled: bool,
        roi_percentage: i128,
        token: Address,
        usdc: Address,
    ) -> Address {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::VaultContractWasm)
            .unwrap();

        let constructor_args: Vec<Val> = (
            vault_admin,
            enabled,
            roi_percentage,
            token,
            usdc,
        )
            .into_val(&env);

        env.deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, constructor_args)
    }

    // ============ Full Suite Deploy ============

    /// Deploys all three contracts in the correct order resolving the circular
    /// dependency between token-factory and participation-token.
    ///
    /// Strategy:
    /// 1. Deploy token-factory with the deployer contract as temporary mint_authority
    /// 2. Deploy participation-token pointing to the new token-factory
    /// 3. Transfer token-factory mint_authority to the participation-token via `set_admin`
    /// 4. Deploy vault-contract pointing to the new token-factory
    pub fn deploy_all(env: Env, params: DeployAllParams) -> DeployedContracts {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let token_factory_wasm: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::TokenFactoryWasm)
            .unwrap();
        let participation_token_wasm: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::ParticipationTokenWasm)
            .unwrap();
        let vault_contract_wasm: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::VaultContractWasm)
            .unwrap();

        // Step 1: Deploy token-factory with this deployer contract as temporary mint_authority.
        let deployer_addr = env.current_contract_address();

        let token_factory_args: Vec<Val> = (
            params.token_name,
            params.token_symbol,
            params.escrow_id,
            params.decimal,
            deployer_addr.clone(),
        )
            .into_val(&env);

        let token_factory_addr = env
            .deployer()
            .with_current_contract(params.token_salt)
            .deploy_v2(token_factory_wasm, token_factory_args);

        // Step 2: Deploy participation-token pointing to the new token-factory
        let participation_args: Vec<Val> =
            (params.escrow_contract, token_factory_addr.clone()).into_val(&env);

        let participation_addr = env
            .deployer()
            .with_current_contract(params.participation_salt)
            .deploy_v2(participation_token_wasm, participation_args);

        // Step 3: Transfer token-factory mint_authority from deployer to participation-token.
        let set_admin_args = vec![&env, participation_addr.clone().into_val(&env)];
        env.invoke_contract::<()>(
            &token_factory_addr,
            &Symbol::new(&env, "set_admin"),
            set_admin_args,
        );

        // Step 4: Deploy vault-contract pointing to the token-factory
        let vault_args: Vec<Val> = (
            params.vault_admin,
            params.vault_enabled,
            params.roi_percentage,
            token_factory_addr.clone(),
            params.usdc,
        )
            .into_val(&env);

        let vault_addr = env
            .deployer()
            .with_current_contract(params.vault_salt)
            .deploy_v2(vault_contract_wasm, vault_args);

        DeployedContracts {
            token_factory: token_factory_addr,
            participation_token: participation_addr,
            vault_contract: vault_addr,
        }
    }

    // ============ Admin Functions ============

    /// Updates a WASM hash for a contract type.
    pub fn update_wasm(env: Env, key: DataKey, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&key, &new_wasm_hash);
    }

    /// Returns the stored admin address.
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}
