/**
 * Vault Contract Error Codes
 * These match the ContractError enum in the vault Rust smart contract
 */
export enum VaultContractError {
  AdminNotFound = 1,
  OnlyAdminCanChangeAvailability = 2,
  ExchangeIsCurrentlyDisabled = 3,
  BeneficiaryHasNoTokensToClaim = 4,
  VaultDoesNotHaveEnoughUSDC = 5,
}

/**
 * Token Sale Contract Error Codes
 * These match the ContractError enum in the token-sale Rust smart contract
 */
export enum TokenSaleContractError {
  EscrowContractNotFound = 1,
  ParticipationTokenNotFound = 2,
  AdminNotFound = 3,
  OnlyAdminCanSetToken = 4,
  HardCapExceeded = 5,
  InvestorCapExceeded = 6,
  AmountMustBePositive = 7,
}

const VAULT_ERROR_MESSAGES: Record<VaultContractError, string> = {
  [VaultContractError.AdminNotFound]: "Admin not found",
  [VaultContractError.OnlyAdminCanChangeAvailability]:
    "Only admin can change availability",
  [VaultContractError.ExchangeIsCurrentlyDisabled]:
    "Exchange is currently disabled",
  [VaultContractError.BeneficiaryHasNoTokensToClaim]:
    "Beneficiary has no tokens to claim",
  [VaultContractError.VaultDoesNotHaveEnoughUSDC]:
    "Vault does not have enough USDC",
};

const TOKEN_SALE_ERROR_MESSAGES: Record<TokenSaleContractError, string> = {
  [TokenSaleContractError.EscrowContractNotFound]:
    "Escrow contract not found",
  [TokenSaleContractError.ParticipationTokenNotFound]:
    "Participation token not found",
  [TokenSaleContractError.AdminNotFound]: "Admin not found",
  [TokenSaleContractError.OnlyAdminCanSetToken]:
    "Only admin can set token",
  [TokenSaleContractError.HardCapExceeded]:
    "Hard cap exceeded – the campaign is fully funded",
  [TokenSaleContractError.InvestorCapExceeded]:
    "Investor cap exceeded – you have reached the maximum investment",
  [TokenSaleContractError.AmountMustBePositive]:
    "Amount must be positive",
};

const ERROR_MESSAGES_BY_CONTEXT: Record<
  string,
  Record<number, string>
> = {
  vault: VAULT_ERROR_MESSAGES,
  "token-sale": TOKEN_SALE_ERROR_MESSAGES,
};

type TranslationFn = (key: string, values?: Record<string, unknown>) => string;

/**
 * Extracts and maps contract error codes to user-friendly messages.
 *
 * When a translation function `t` is provided (from `useTranslations("contractErrors")`),
 * it will use i18n keys like `t("vault.1")` or `t("tokenSale.5")`.
 * Falls back to hardcoded English messages when `t` is not provided.
 *
 * @param error - The raw error from Soroban
 * @param context - Contract context ('vault' | 'token-sale') to select the correct error map
 * @param t - Optional translation function from useTranslations("contractErrors")
 */
export function extractContractError(
  error: unknown,
  context?: "vault" | "token-sale",
  t?: TranslationFn,
): {
  message: string;
  details: string;
} {
  const errorString =
    error instanceof Error ? error.message : String(error);

  // Try to extract error code from Soroban error response
  const errorCodeMatch = errorString.match(/Error\(Contract, #(\d+)\)/);

  if (errorCodeMatch) {
    const errorCode = parseInt(errorCodeMatch[1], 10);

    // Try i18n first
    if (t && context) {
      const i18nContext = context === "token-sale" ? "tokenSale" : context;
      const translatedMessage = t(`${i18nContext}.${errorCode}`);

      // next-intl returns the key path when translation is missing
      if (translatedMessage && !translatedMessage.includes(`${i18nContext}.${errorCode}`)) {
        return {
          message: t("title"),
          details: translatedMessage,
        };
      }

      // Fall back to unknownCode with the code param
      return {
        message: t("title"),
        details: t("unknownCode", { code: errorCode }),
      };
    }

    // Fallback to hardcoded messages
    const errorMap = context
      ? ERROR_MESSAGES_BY_CONTEXT[context]
      : undefined;
    const humanMessage = errorMap?.[errorCode];

    if (humanMessage) {
      return {
        message: "Contract Error",
        details: humanMessage,
      };
    }

    return {
      message: "Contract Error",
      details: `Contract error code ${errorCode}`,
    };
  }

  // Generic error response if no specific error code found
  return {
    message: t ? t("title") : "Contract Error",
    details: errorString,
  };
}
