import { httpClient } from "@/lib/httpClient";

export type BuyTokenPayload = {
  tokenSaleContractId: string;
  usdcAddress: string;
  payerAddress: string;
  beneficiaryAddress: string;
  amount: number;
};

export type ApproveForTrustlinePayload = {
  tokenFactoryId: string;
  tokenSaleContractId: string;
  walletAddress: string;
};

export type DeployTokenResponse = {
  success: boolean;
  xdr: string;
  message: string;
};

export class TokenService {
  async approveForTrustline(
    payload: ApproveForTrustlinePayload,
  ): Promise<DeployTokenResponse> {
    const { data } = await httpClient.post<{ unsignedXdr: string }>(
      "/participation-token/approve-for-trustline",
      {
        contractId: payload.tokenFactoryId,
        from: payload.walletAddress,
        spender: payload.tokenSaleContractId,
        callerPublicKey: payload.walletAddress,
      },
    );

    return {
      success: true,
      xdr: data.unsignedXdr,
      message: "Trustline transaction built successfully.",
    };
  }

  async buyToken(payload: BuyTokenPayload): Promise<DeployTokenResponse> {
    const { data } = await httpClient.post<{ unsignedXdr: string }>(
      "/token-sale/buy",
      {
        contractId: payload.tokenSaleContractId,
        usdcAddress: payload.usdcAddress,
        payer: payload.payerAddress,
        beneficiary: payload.beneficiaryAddress,
        amount: payload.amount,
        callerPublicKey: payload.payerAddress,
      },
    );

    return {
      success: true,
      xdr: data.unsignedXdr,
      message: "Transaction built successfully.",
    };
  }
}
