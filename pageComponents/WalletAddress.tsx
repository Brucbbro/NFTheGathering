import React from "react"
import { Link, Tooltip } from "@chakra-ui/react"
import { useWalletStore } from "../stateManagement"

export default function WalletAddress({ addr = "", ...props }: { addr: string }) {
  const walletAddress = useWalletStore(state => state.walletAddress)
  const isCurrentWallet = walletAddress?.toLowerCase() === addr.toLowerCase()
  return (
    <Tooltip label={addr + "\n  -  (click to view on LooksRare)"} {...props}>
      <Link href={`https://looksrare.org/accounts/${addr}`} fontWeight={"bold"}>
        {isCurrentWallet ? "YOU" : addr.slice(2, 8)}
      </Link>
    </Tooltip>
  )
}
