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
  /** Core API base URL (e.g. http://localhost:4000). When not set, uses NEXT_PUBLIC_CORE_API_URL or fallback "/api". */
  baseURL?: string;
  /** API key for core API (x-api-key). Required when baseURL points to core. */
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

    // Prefer explicit option, then server-side secrets, then public envs
    let apiKey =
      options.apiKey?.trim() ||
      // When running on the server (Next.js SSR / route handlers), prefer
      // the same secrets that the Core API uses in its ApiKeyGuard
      (typeof window === "undefined"
        ? env.BACKOFFICE_API_KEY?.trim() ||
          env.INVESTORS_API_KEY?.trim() ||
          ""
        : "") ||
      // Fallback to public envs for purely browser-side usage
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


