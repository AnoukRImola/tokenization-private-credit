import axios, { AxiosInstance } from "axios";

export type SendTransactionPayload = {
  signedXdr: string;
};

export type SendTransactionResponse = {
  status: string;
  message: string;
  hash?: string;
};

export type SendTransactionServiceOptions = {
  baseURL?: string;
  apiKey?: string;
};

export class SendTransactionService {
  private readonly axios: AxiosInstance;

  constructor(options: SendTransactionServiceOptions = {}) {
    const envApiUrl =
      typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CORE_API_URL;
    const baseURL =
      options.baseURL ??
      (envApiUrl && String(envApiUrl).trim() !== "" ? envApiUrl : "/api");

    const headers: Record<string, string> = {};
    const env =
      typeof process !== "undefined" ? process.env : ({} as NodeJS.ProcessEnv);

    let apiKey =
      options.apiKey?.trim() ||
      (typeof window === "undefined"
        ? env.BACKOFFICE_API_KEY?.trim() ||
        env.INVESTORS_API_KEY?.trim() ||
        ""
        : "") ||
      env.NEXT_PUBLIC_API_KEY?.trim() ||
      env.NEXT_PUBLIC_INVESTORS_API_KEY?.trim() ||
      env.NEXT_PUBLIC_BACKOFFICE_API_KEY?.trim() ||
      "";

    if (apiKey !== "") {
      headers["x-api-key"] = apiKey;
    }

    this.axios = axios.create({
      baseURL,
      headers,
    });
  }

  async sendTransaction(
    payload: SendTransactionPayload
  ): Promise<SendTransactionResponse> {
    const response = await this.axios.post<SendTransactionResponse>(
      "/helper/send-transaction",
      payload
    );
    return response.data;
  }
}


