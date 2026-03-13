import { httpClient } from "@/lib/httpClient";

export type DeployTokenResponse = {
  success: boolean;
  tokenFactoryAddress: string;
  tokenSaleAddress: string;
};

export type DeployTokenParams = {
  escrowContractId: string;
  tokenName: string;
  tokenSymbol: string;
};

export class TokenService {
  async deployToken(params: DeployTokenParams): Promise<DeployTokenResponse> {
    const response = await httpClient.post<DeployTokenResponse>("/deploy", {
      escrowContractId: params.escrowContractId,
      tokenName: params.tokenName,
      tokenSymbol: params.tokenSymbol,
    });

    return response.data;
  }
}
