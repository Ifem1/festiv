export const FESTIV_CHAIN = {
  id: Number(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID ?? "61999"),
  rpcUrl: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ?? "https://studio.genlayer.com/api",
  explorerUrl: process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL ?? "https://explorer-studio.genlayer.com",
  contractAddress: process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS ?? "",
};

export function getExplorerTxUrl(hash: string): string {
  return `${FESTIV_CHAIN.explorerUrl}/tx/${hash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${FESTIV_CHAIN.explorerUrl}/address/${address}`;
}
