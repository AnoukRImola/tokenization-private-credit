#![cfg(test)]
extern crate std;

use crate::sale::{ParticipationTokenContract, ParticipationTokenContractClient};
use escrow::{Escrow, EscrowContract, EscrowContractClient, Flags, Milestone, Roles, Trustline};
use soroban_sdk::{testutils::Address as _, token, vec, Address, Env, String};
use token::Client as TokenClient;
use token::StellarAssetClient as TokenAdminClient;
use soroban_token_contract::{Token as FactoryToken, TokenClient as FactoryTokenClient};

fn create_usdc_token<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(e, &sac.address()),
        TokenAdminClient::new(e, &sac.address()),
    )
}

fn create_escrow_contract<'a>(env: &Env) -> EscrowContractClient<'a> {
    EscrowContractClient::new(env, &env.register(EscrowContract {}, ()))
}

fn create_token_factory<'a>(e: &Env, mint_authority: &Address) -> FactoryTokenClient<'a> {
    let token_contract = e.register(
        FactoryToken,
        (
            String::from_str(e, "SaleToken"),
            String::from_str(e, "SALE"),
            String::from_str(e, "eng_1"),
            7_u32,
            mint_authority,
        ),
    );
    FactoryTokenClient::new(e, &token_contract)
}

fn create_participation_token<'a>(e: &Env, escrow_addr: &Address, sale_token_addr: &Address) -> ParticipationTokenContractClient<'a> {
    let contract_id = e.register(ParticipationTokenContract, (escrow_addr.clone(), sale_token_addr.clone()));
    ParticipationTokenContractClient::new(e, &contract_id)
}

#[test]
fn test_buy_transfers_usdc_and_mints_sale_token() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let payer = Address::generate(&env);
    let beneficiary = Address::generate(&env);

    // 1) Create USDC
    let (usdc_client, usdc_admin) = create_usdc_token(&env, &admin);

    // 2) Create Escrow contract
    let escrow_client = create_escrow_contract(&env);
    let engagement_id = String::from_str(&env, "eng_1");

    let roles = Roles {
        approver: payer.clone(),
        service_provider: beneficiary.clone(),
        platform_address: admin.clone(),
        release_signer: payer.clone(),
        dispute_resolver: admin.clone(),
    };

    let flags = Flags {
        disputed: false,
        released: false,
        resolved: false,
        approved: false,
    };

    let trustline = Trustline {
        address: usdc_client.address.clone(),
    };

    let amount: i128 = 100;

    let milestones = vec![
        &env,
        Milestone {
            description: String::from_str(&env, "m1"),
            status: String::from_str(&env, "Pending"),
            evidence: String::from_str(&env, ""),
            amount,
            flags: flags.clone(),
            receiver: beneficiary.clone(),
        },
    ];

    let escrow_properties = Escrow {
        engagement_id,
        title: String::from_str(&env, "Test Escrow"),
        description: String::from_str(&env, "Test Escrow Description"),
        roles,
        platform_fee: 0,
        milestones,
        trustline,
        receiver_memo: 0,
    };

    escrow_client.initialize_escrow(&escrow_properties);

    // 3) Create token-factory with a temporary admin as mint_authority
    let temp_admin = Address::generate(&env);
    let sale_token = create_token_factory(&env, &temp_admin);

    // 4) Create ParticipationToken passing the escrow and token-factory addresses
    let participation_token_client = create_participation_token(&env, &escrow_client.address, &sale_token.address);

    // 5) Transfer mint authority of token-factory to the ParticipationToken contract
    sale_token.set_admin(&participation_token_client.address);

    // 6) Fund USDC to the payer so they can buy
    usdc_admin.mint(&payer, &amount);

    // 7) Execute buy
    participation_token_client.buy(&usdc_client.address, &payer, &beneficiary, &amount);

    // 8) Verify that the escrow received the USDC
    let escrow_balance = usdc_client.balance(&escrow_client.address);
    assert_eq!(escrow_balance, amount);

    // 9) Verify that the beneficiary received the minted sale tokens
    let sale_token_balance = sale_token.balance(&beneficiary);
    assert_eq!(sale_token_balance, amount);
}
