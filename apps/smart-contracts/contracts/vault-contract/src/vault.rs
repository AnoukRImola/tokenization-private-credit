use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};
use token::Client as TokenClient;

use crate::error::ContractError;
use crate::events::{events, AvailabilityChangedEvent, ClaimEvent};
use crate::storage_types::DataKey;

/// A complete snapshot of the vault's current state.
/// Useful for dashboards, analytics, and indexer integrations.
#[derive(Clone, Debug)]
#[contracttype]
pub struct VaultOverview {
    pub admin: Address,
    pub enabled: bool,
    pub roi_percentage: i128,
    pub token_address: Address,
    pub usdc_address: Address,
    pub vault_usdc_balance: i128,
    pub total_tokens_redeemed: i128,
}

/// Information about a beneficiary's claimable ROI.
#[derive(Clone, Debug)]
#[contracttype]
pub struct ClaimPreview {
    pub token_balance: i128,
    pub usdc_amount: i128,
    pub roi_amount: i128,
    pub vault_has_sufficient_balance: bool,
    pub claim_enabled: bool,
}

#[contract]
pub struct VaultContract;

/// Calculates USDC payout: token_balance * (100 + roi_percentage) / 100
/// Returns Err on overflow.
fn calculate_usdc_amount(
    token_balance: i128,
    roi_percentage: i128,
) -> Result<i128, ContractError> {
    let rate = 100_i128
        .checked_add(roi_percentage)
        .ok_or(ContractError::ArithmeticOverflow)?;
    let numerator = token_balance
        .checked_mul(rate)
        .ok_or(ContractError::ArithmeticOverflow)?;
    numerator
        .checked_div(100)
        .ok_or(ContractError::ArithmeticOverflow)
}

/// Helper to read a required value from instance storage.
fn get_required<T: soroban_sdk::TryFromVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
) -> Result<T, ContractError> {
    env.storage()
        .instance()
        .get(key)
        .ok_or(ContractError::NotInitialized)
}

#[contractimpl]
impl VaultContract {
    // ============ Constructor ============

    pub fn __constructor(
        env: Env,
        admin: Address,
        enabled: bool,
        roi_percentage: i128,
        token: Address,
        usdc: Address,
    ) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Enabled, &enabled);
        env.storage()
            .instance()
            .set(&DataKey::RoiPercentage, &roi_percentage);
        env.storage()
            .instance()
            .set(&DataKey::TokenAddress, &token);
        env.storage().instance().set(&DataKey::UsdcAddress, &usdc);
        env.storage()
            .instance()
            .set(&DataKey::TotalTokensRedeemed, &0_i128);
    }

    // ============ Admin Functions ============

    pub fn availability_for_exchange(
        env: Env,
        admin: Address,
        enabled: bool,
    ) -> Result<(), ContractError> {
        admin.require_auth();

        let stored_admin: Address = get_required(&env, &DataKey::Admin)?;

        if admin != stored_admin {
            return Err(ContractError::OnlyAdminCanChangeAvailability);
        }

        env.storage().instance().set(&DataKey::Enabled, &enabled);

        events::emit_availability_changed(
            &env,
            AvailabilityChangedEvent {
                admin: admin.clone(),
                enabled,
            },
        );

        Ok(())
    }

    // ============ Claim Function ============

    pub fn claim(env: Env, beneficiary: Address) -> Result<(), ContractError> {
        beneficiary.require_auth();

        let enabled: bool = get_required(&env, &DataKey::Enabled)?;

        if !enabled {
            return Err(ContractError::ExchangeIsCurrentlyDisabled);
        }

        let roi_percentage: i128 = get_required(&env, &DataKey::RoiPercentage)?;
        let token_address: Address = get_required(&env, &DataKey::TokenAddress)?;

        let token_client = TokenClient::new(&env, &token_address);
        let token_balance = token_client.balance(&beneficiary);

        if token_balance == 0 {
            return Err(ContractError::BeneficiaryHasNoTokensToClaim);
        }

        let usdc_amount = calculate_usdc_amount(token_balance, roi_percentage)?;

        let usdc_address: Address = get_required(&env, &DataKey::UsdcAddress)?;

        let usdc_client = TokenClient::new(&env, &usdc_address);
        let vault_usdc_balance = usdc_client.balance(&env.current_contract_address());

        if vault_usdc_balance < usdc_amount {
            return Err(ContractError::VaultDoesNotHaveEnoughUSDC);
        }

        // Execute the token exchange
        token_client.burn(&beneficiary, &token_balance);
        usdc_client.transfer(&env.current_contract_address(), &beneficiary, &usdc_amount);

        // Update total tokens redeemed
        let total_redeemed: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalTokensRedeemed)
            .unwrap_or(0);
        let new_total = total_redeemed
            .checked_add(token_balance)
            .ok_or(ContractError::ArithmeticOverflow)?;
        env.storage()
            .instance()
            .set(&DataKey::TotalTokensRedeemed, &new_total);

        events::emit_claim(
            &env,
            ClaimEvent {
                beneficiary: beneficiary.clone(),
                tokens_redeemed: token_balance,
                usdc_received: usdc_amount,
                roi_percentage,
            },
        );

        Ok(())
    }

    // ============ View/Getter Functions ============

    pub fn get_admin(env: Env) -> Result<Address, ContractError> {
        get_required(&env, &DataKey::Admin)
    }

    pub fn is_enabled(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Enabled)
            .unwrap_or(false)
    }

    pub fn get_roi_percentage(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .unwrap_or(0)
    }

    pub fn get_token_address(env: Env) -> Result<Address, ContractError> {
        get_required(&env, &DataKey::TokenAddress)
    }

    pub fn get_usdc_address(env: Env) -> Result<Address, ContractError> {
        get_required(&env, &DataKey::UsdcAddress)
    }

    pub fn get_vault_usdc_balance(env: Env) -> Result<i128, ContractError> {
        let usdc_address: Address = get_required(&env, &DataKey::UsdcAddress)?;
        let usdc_client = TokenClient::new(&env, &usdc_address);
        Ok(usdc_client.balance(&env.current_contract_address()))
    }

    pub fn get_total_tokens_redeemed(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalTokensRedeemed)
            .unwrap_or(0)
    }

    // ============ Preview Functions ============

    pub fn preview_claim(env: Env, beneficiary: Address) -> Result<ClaimPreview, ContractError> {
        let roi_percentage: i128 = env
            .storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .unwrap_or(0);

        let token_address: Address = get_required(&env, &DataKey::TokenAddress)?;

        let token_client = TokenClient::new(&env, &token_address);
        let token_balance = token_client.balance(&beneficiary);

        let usdc_amount = if token_balance > 0 {
            calculate_usdc_amount(token_balance, roi_percentage)?
        } else {
            0
        };

        let roi_amount = usdc_amount
            .checked_sub(token_balance)
            .ok_or(ContractError::ArithmeticOverflow)?;

        let usdc_address: Address = get_required(&env, &DataKey::UsdcAddress)?;

        let usdc_client = TokenClient::new(&env, &usdc_address);
        let vault_usdc_balance = usdc_client.balance(&env.current_contract_address());

        let enabled: bool = env
            .storage()
            .instance()
            .get(&DataKey::Enabled)
            .unwrap_or(false);

        Ok(ClaimPreview {
            token_balance,
            usdc_amount,
            roi_amount,
            vault_has_sufficient_balance: vault_usdc_balance >= usdc_amount,
            claim_enabled: enabled,
        })
    }

    // ============ Overview Functions ============

    pub fn get_vault_overview(env: Env) -> Result<VaultOverview, ContractError> {
        let admin: Address = get_required(&env, &DataKey::Admin)?;

        let enabled: bool = env
            .storage()
            .instance()
            .get(&DataKey::Enabled)
            .unwrap_or(false);

        let roi_percentage: i128 = env
            .storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .unwrap_or(0);

        let token_address: Address = get_required(&env, &DataKey::TokenAddress)?;
        let usdc_address: Address = get_required(&env, &DataKey::UsdcAddress)?;

        let usdc_client = TokenClient::new(&env, &usdc_address);
        let vault_usdc_balance = usdc_client.balance(&env.current_contract_address());

        let total_tokens_redeemed: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalTokensRedeemed)
            .unwrap_or(0);

        Ok(VaultOverview {
            admin,
            enabled,
            roi_percentage,
            token_address,
            usdc_address,
            vault_usdc_balance,
            total_tokens_redeemed,
        })
    }
}
