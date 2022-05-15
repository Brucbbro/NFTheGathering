import React from "react"
import { ethers } from "ethers"
import { useNFTTokenData, useTokenOffers } from "../hooks"
import { LRCollection, LRCollStats, NFTData } from "../types"

export default function useNFTData({
  collection,
  tokenId,
}: {
  collection: LRCollection & { stats?: LRCollStats }
  tokenId: string
}) {
  const { data: apiData, isLoading: isTokenDataLoading, error } = useNFTTokenData(collection.address, tokenId)
  const [owner, setNFTOwner] = React.useState<string>("")
  const { data: tokenOffers, isLoading: isOffersLoading } = useTokenOffers(collection.address, tokenId)
  React.useEffect(() => {
    //@ts-ignore window.ethereum is injected by metamask
    if (apiData?.tokenId && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const collectionContract = new ethers.Contract(
        collection.address,
        ["function ownerOf(uint256 tokenId) view returns (address)"],
        provider,
      )

      collectionContract
        .ownerOf(apiData.tokenId)
        .then((res: string) => {
          setNFTOwner(res)
        })
        .catch((e: any) => setNFTOwner(""))
    }
  }, [collection.address, apiData?.tokenId])

  const data: NFTData & { isLoading: boolean; owner: string } = {
    ...apiData,
    isLoading: isTokenDataLoading || isOffersLoading,
    owner,
    collection,
    offers: tokenOffers || [],
  }

  return data
}
