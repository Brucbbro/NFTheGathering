import React from "react"
import { Button } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useWalletStore } from "../stateManagement"

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useWalletStore(state => [state.walletAddress, state.setWalletAddress])
  async function connectWallet() {
    //@ts-ignore window.ethereum is injected by metamask
    const provider = new ethers.providers.Web3Provider(window?.ethereum)
    try {
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      setWalletAddress(await signer.getAddress())
    } catch (e) {
      console.log("wallet not connected", e)
    }
  }
  return walletAddress ? (
    <Button disabled>{walletAddress.substring(2, 8)}</Button>
  ) : (
    <Button onClick={connectWallet}>CONNECT</Button>
  )
}
