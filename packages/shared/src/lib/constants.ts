const USDC_ADDRESS =
    process.env.NEXT_PUBLIC_DEFAULT_USDC_ADDRESS ||
    "";

const SOROBAN_RPC_URL =
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    "";

const NETWORK_PASSPHRASE =
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ||
    "";

const ESCROW_EXPLORER_URL = "https://viewer.trustlesswork.com/"

export { USDC_ADDRESS, SOROBAN_RPC_URL, NETWORK_PASSPHRASE, ESCROW_EXPLORER_URL };