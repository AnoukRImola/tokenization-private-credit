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
    /// The admin address that controls the vault
    pub admin: Address,
    /// Whether claiming is currently enabled
    pub enabled: bool,
    /// The ROI percentage (e.g., 5 = 5% return on investment)
    pub roi_percentage: i128,
    /// The participation token contract address
    pub token_address: Address,
    /// The USDC stablecoin contract address
    pub usdc_address: Address,
    /// Current USDC balance available in the vault
    pub vault_usdc_balance: i128,
    /// Total participation tokens that have been redeemed
    pub total_tokens_redeemed: i128,
}

/// Information about a beneficiary's claimable ROI.
#[derive(Clone, Debug)]
#[contracttype]
pub struct ClaimPreview {
    /// The beneficiary's current token balance
    pub token_balance: i128,
    /// The amount of USDC the beneficiary would receive
    pub usdc_amount: i128,
    /// The ROI portion of the USDC amount (profit)
    pub roi_amount: i128,
    /// Whether the vault has enough USDC to fulfill this claim
    pub vault_has_sufficient_balance: bool,
    /// Whether claiming is currently enabled
    pub claim_enabled: bool,
}

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {
    // ============ Constructor ============

    /// Initializes the vault contract with the given parameters.
    ///
    /// # Arguments
    /// * `admin` - The address that will control vault availability
    /// * `enabled` - Initial state of whether claiming is enabled
    /// * `roi_percentage` - The ROI percentage (e.g., 5 for 5% return)
    /// * `token` - The token factory address
    /// * `usdc` - The USDC stablecoin contract address
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

    /// Enables or disables the vault for ROI claiming.
    /// Only the admin can call this function.
    ///
    /// # Arguments
    /// * `admin` - Must be the contract admin address
    /// * `enabled` - The new availability state
    ///
    /// # Errors
    /// * `AdminNotFound` - If admin is not set in storage
    /// * `OnlyAdminCanChangeAvailability` - If caller is not the admin
    pub fn availability_for_exchange(
        env: Env,
        admin: Address,
        enabled: bool,
    ) -> Result<(), ContractError> {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::AdminNotFound)?;

        if admin != stored_admin {
            return Err(ContractError::OnlyAdminCanChangeAvailability);
        }

        env.storage().instance().set(&DataKey::Enabled, &enabled);

        // Emit availability changed event
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

    /// Claims ROI for the beneficiary by exchanging their participation tokens for USDC.
    /// The beneficiary receives their tokens' value plus the ROI percentage.
    ///
    /// Formula: usdc_amount = token_balance * (100 + roi_percentage) / 100
    ///
    /// # Arguments
    /// * `beneficiary` - The address claiming their ROI (must have tokens)
    ///
    /// # Errors
    /// * `EnabledNotFound` - If enabled flag is not set in storage
    /// * `ExchangeIsCurrentlyDisabled` - If vault is disabled
    /// * `RoiPercentageNotFound` - If ROI percentage is not set in storage
    /// * `TokenAddressNotFound` - If token address is not set in storage
    /// * `BeneficiaryHasNoTokensToClaim` - If beneficiary has zero tokens
    /// * `UsdcAddressNotFound` - If USDC address is not set in storage
    /// * `VaultDoesNotHaveEnoughUSDC` - If vault cannot cover the claim
    /// * `ArithmeticOverflow` - If total tokens redeemed overflows
    pub fn claim(env: Env, beneficiary: Address) -> Result<(), ContractError> {
        beneficiary.require_auth();

        let enabled: bool = env
            .storage()
            .instance()
            .get(&DataKey::Enabled)
            .ok_or(ContractError::EnabledNotFound)?;

        if !enabled {
            return Err(ContractError::ExchangeIsCurrentlyDisabled);
        }

        let roi_percentage: i128 = env
            .storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .ok_or(ContractError::RoiPercentageNotFound)?;

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .ok_or(ContractError::TokenAddressNotFound)?;

        let token_client = TokenClient::new(&env, &token_address);
        let token_balance = token_client.balance(&beneficiary);

        if token_balance == 0 {
            return Err(ContractError::BeneficiaryHasNoTokensToClaim);
        }

        let usdc_amount = (token_balance * (100 + roi_percentage)) / 100;

        let usdc_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::UsdcAddress)
            .ok_or(ContractError::UsdcAddressNotFound)?;

        let usdc_client = TokenClient::new(&env, &usdc_address);
        let vault_usdc_balance = usdc_client.balance(&env.current_contract_address());

        if vault_usdc_balance < usdc_amount {
            return Err(ContractError::VaultDoesNotHaveEnoughUSDC);
        }

        // Execute the token exchange
        token_client.burn(&beneficiary, &token_balance);
        usdc_client.transfer(&env.current_contract_address(), &beneficiary, &usdc_amount);

        // Update total tokens redeemed (checked arithmetic — #26)
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

        // Emit claim event for indexers and explorers
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

    /// Returns the admin address.
    pub fn get_admin(env: Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::AdminNotFound)
    }

    /// Returns whether claiming is currently enabled.
    pub fn is_enabled(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Enabled)
            .unwrap_or(false)
    }

    /// Returns the ROI percentage (e.g., 5 means 5% return).
    pub fn get_roi_percentage(env: Env) -> Result<i128, ContractError> {
        env.storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .ok_or(ContractError::RoiPercentageNotFound)
    }

    /// Returns the participation token contract address.
    pub fn get_token_address(env: Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .ok_or(ContractError::TokenAddressNotFound)
    }

    /// Returns the USDC stablecoin contract address.
    pub fn get_usdc_address(env: Env) -> Result<Address, ContractError> {
        env.storage()
            .instance()
            .get(&DataKey::UsdcAddress)
            .ok_or(ContractError::UsdcAddressNotFound)
    }

    /// Returns the current USDC balance held by the vault.
    pub fn get_vault_usdc_balance(env: Env) -> Result<i128, ContractError> {
        let usdc_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::UsdcAddress)
            .ok_or(ContractError::UsdcAddressNotFound)?;

        let usdc_client = TokenClient::new(&env, &usdc_address);
        Ok(usdc_client.balance(&env.current_contract_address()))
    }

    /// Returns the total amount of participation tokens that have been redeemed.
    pub fn get_total_tokens_redeemed(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalTokensRedeemed)
            .unwrap_or(0)
    }

    // ============ Preview Functions ============

    /// Previews the claim for a beneficiary without executing it.
    /// Returns detailed information about what the beneficiary would receive.
    ///
    /// # Arguments
    /// * `beneficiary` - The address to preview the claim for
    ///
    /// # Returns
    /// A `ClaimPreview` struct with all relevant claim information
    pub fn preview_claim(env: Env, beneficiary: Address) -> Result<ClaimPreview, ContractError> {
        let roi_percentage: i128 = env
            .storage()
            .instance()
            .get(&DataKey::RoiPercentage)
            .unwrap_or(0);

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .ok_or(ContractError::TokenAddressNotFound)?;

        let token_client = TokenClient::new(&env, &token_address);
        let token_balance = token_client.balance(&beneficiary);

        let usdc_amount = if token_balance > 0 {
            (token_balance * (100 + roi_percentage)) / 100
        } else {
            0
        };

        let roi_amount = usdc_amount - token_balance;

        let usdc_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::UsdcAddress)
            .ok_or(ContractError::UsdcAddressNotFound)?;

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

    /// Returns a complete snapshot of the vault's current state.
    /// Useful for dashboards and analytics integrations.
    pub fn get_vault_overview(env: Env) -> Result<VaultOverview, ContractError> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(ContractError::AdminNotFound)?;

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

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .ok_or(ContractError::TokenAddressNotFound)?;

        let usdc_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::UsdcAddress)
            .ok_or(ContractError::UsdcAddressNotFound)?;

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
