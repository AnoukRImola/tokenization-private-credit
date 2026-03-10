export declare class SorobanService {
    private readonly rpcUrl;
    private readonly networkPassphrase;
    constructor();
    buildDeployTransaction(wasmHash: string, args: Record<string, unknown>, callerPublicKey: string): Promise<string>;
    buildContractCallTransaction(contractId: string, method: string, args: Record<string, unknown>, callerPublicKey: string): Promise<string>;
}
