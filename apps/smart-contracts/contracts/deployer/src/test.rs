#![cfg(test)]
extern crate std;

use crate::deployer::{DeployAllParams, DeployerContract, DeployerContractClient};
use crate::storage_types::DataKey;
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

mod token_factory_wasm {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/soroban_token_contract.wasm"
    );
}

mod participation_token_wasm {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/participation_token.wasm"
    );
}

mod vault_contract_wasm {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32v1-none/release/vault_contract.wasm"
    );
}

fn setup_deployer<'a>(env: &Env, admin: &Address) -> DeployerContractClient<'a> {
    let token_factory_hash = env.deployer().upload_contract_wasm(token_factory_wasm::WASM);
    let participation_token_hash = env.deployer().upload_contract_wasm(participation_token_wasm::WASM);
    let vault_contract_hash = env.deployer().upload_contract_wasm(vault_contract_wasm::WASM);

    let contract_id = env.register(
        DeployerContract,
        (
            admin.clone(),
            token_factory_hash,
            participation_token_hash,
            vault_contract_hash,
        ),
    );

    DeployerContractClient::new(env, &contract_id)
}

#[test]
fn test_deploy_token_factory() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let mint_authority = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    let salt = BytesN::from_array(&env, &[1u8; 32]);

    let token_addr = deployer.deploy_token_factory(
        &salt,
        &String::from_str(&env, "TestToken"),
        &String::from_str(&env, "TST"),
        &String::from_str(&env, "escrow-001"),
        &7u32,
        &mint_authority,
    );

    assert_ne!(token_addr, admin);
}

#[test]
fn test_deploy_participation_token() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let escrow_contract = Address::generate(&env);
    let token_factory = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    let salt = BytesN::from_array(&env, &[2u8; 32]);

    let participation_addr =
        deployer.deploy_participation_token(&salt, &escrow_contract, &token_factory);

    assert_ne!(participation_addr, admin);
}

#[test]
fn test_deploy_vault_contract() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let vault_admin = Address::generate(&env);
    let token = Address::generate(&env);
    let usdc = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    let salt = BytesN::from_array(&env, &[3u8; 32]);

    let vault_addr =
        deployer.deploy_vault_contract(&salt, &vault_admin, &true, &5i128, &token, &usdc);

    assert_ne!(vault_addr, admin);
}

#[test]
fn test_deploy_all() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let escrow_contract = Address::generate(&env);
    let vault_admin = Address::generate(&env);
    let usdc = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    let token_salt = BytesN::from_array(&env, &[10u8; 32]);
    let participation_salt = BytesN::from_array(&env, &[11u8; 32]);
    let vault_salt = BytesN::from_array(&env, &[12u8; 32]);

    let result = deployer.deploy_all(&DeployAllParams {
        token_salt,
        participation_salt,
        vault_salt,
        token_name: String::from_str(&env, "CampaignToken"),
        token_symbol: String::from_str(&env, "CAMP"),
        escrow_id: String::from_str(&env, "escrow-001"),
        decimal: 7u32,
        escrow_contract,
        vault_admin,
        vault_enabled: true,
        roi_percentage: 5i128,
        usdc,
    });

    // All three deployed addresses should be distinct
    assert_ne!(result.token_factory, result.participation_token);
    assert_ne!(result.token_factory, result.vault_contract);
    assert_ne!(result.participation_token, result.vault_contract);
}

#[test]
fn test_update_wasm() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    let new_hash = BytesN::from_array(&env, &[99u8; 32]);
    deployer.update_wasm(&DataKey::TokenFactoryWasm, &new_hash);
}

#[test]
fn test_get_admin() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let deployer = setup_deployer(&env, &admin);

    assert_eq!(deployer.get_admin(), admin);
}
