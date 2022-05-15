import React from "react"
import { Button } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useWalletStore } from "../stateManagement"
import { useToast } from "@chakra-ui/react"

export default function WalletConnectButton() {
  const toast = useToast()
  const [walletAddress, setWalletAddress] = useWalletStore(state => [state.walletAddress, state.setWalletAddress])
  async function connectWallet() {
    if (!window.ethereum) {
      toast({
        title: "Uh oh!",
        description: "It seems like you don't have a wallet extension installed in this browser.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        setWalletAddress(await signer.getAddress())
      } catch (e) {
        console.log("wallet not connected", e)
      }
    }
  }

  return walletAddress ? (
    <Button colorScheme={"blue"} disabled>
      {walletAddress.substring(2, 8)}
    </Button>
  ) : (
    <Button colorScheme={"blue"} onClick={connectWallet}>
      CONNECT
    </Button>
  )
}
