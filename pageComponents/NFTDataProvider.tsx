import React from "react"
import { ethers } from "ethers"
import { useNFTTokenData, useTokenOrders } from "../hooks"
import { LRCollection, LRCollStats, NFTData } from "../types"
import { useWalletStore } from "../stateManagement"

export default function useNFTData({
  collection,
  tokenId,
}: {
  collection: LRCollection & { stats?: LRCollStats }
  tokenId: string
}) {
  const { data: apiData, isLoading: isTokenDataLoading, error } = useNFTTokenData(collection.address, tokenId)
  const [owner, setNFTOwner] = React.useState<string>("")
  const { data: orders, isLoading: isOffersLoading } = useTokenOrders(collection.address, tokenId)
  const wallet = useWalletStore(state => state.walletAddress)
  React.useEffect(() => {
    if (apiData?.tokenId && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const collectionContract = new ethers.Contract(
        collection.address,
        [
          "function ownerOf(uint256 tokenId) view returns (address)",
          "function balanceOf(address account, uint256 tokenId) view returns (uint256)",
        ],
        provider,
      )
      if (collection.type === "ERC721") {
        collectionContract
          .ownerOf(apiData.tokenId)
          .then((res: string) => {
            setNFTOwner(res)
          })
          .catch((e: any) => setNFTOwner(""))
      } else if (collection.type === "ERC1155" && wallet) {
        collectionContract
          .balanceOf(wallet, apiData.tokenId)
          .then((res: string) => {
            parseInt(res) > 0 ? setNFTOwner(wallet) : setNFTOwner("")
          })
          .catch((e: any) => setNFTOwner(""))
      }
    }
  }, [collection, apiData?.tokenId, wallet])

  console.log({ apiData })
  const data: NFTData & { isLoading: boolean; owner: string } = {
    ...apiData,
    isLoading: !apiData.tokenId || isTokenDataLoading || isOffersLoading,
    owner,
    collection,
    orders: orders || [],
  }

  return data
}
