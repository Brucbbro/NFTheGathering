import create from "zustand"

export interface WalletStoreType {
  walletAddress: string | null
  setWalletAddress: Function
}

export const useWalletStore = create<WalletStoreType>(set => ({
  walletAddress: null,
  setWalletAddress: (addr: string) => set(state => ({ walletAddress: addr })),
}))
