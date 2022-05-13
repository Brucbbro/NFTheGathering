import React from "react"
import { ethers } from "ethers"
import { useNFTTokenData, useTokenOffers } from "../hooks"
import { LRCollection, LRCollStats, NFTData } from "../types"

const safeDefaults: NFTData = {
  collection: null,
  floorPrice: 0,
  attributes: [],
  collectionAddress: "",
  description: "",
  image: { src: "" },
  name: "",
  owner: "",
  tokenId: "",
  totalSupply: 10000,
  offers: [],
}

export default function NFTDataProvider({
  children,
  collection,
  tokenId,
}: {
  children: any
  collection: LRCollection & { stats: LRCollStats }
  tokenId: string
}) {
  const { data: apiData, isLoading: isTokenDataLoading, error } = useNFTTokenData(collection.address, tokenId)
  const [owner, setNFTOwner] = React.useState<string | null>(null)
  const { data: tokenOffers, isLoading: isOffersLoading } = useTokenOffers(collection.address, tokenId)
  React.useEffect(() => {
    if (apiData?.tokenId) {
      //@ts-ignore window.ethereum is injected by metamask
      const provider = new ethers.providers.Web3Provider(window?.ethereum)
      const collectionContract = new ethers.Contract(
        collection.address,
        ["function ownerOf(uint256 tokenId) view returns (address)", "function totalSupply() view returns (uint256)"],
        provider,
      )

      collectionContract
        .ownerOf(apiData.tokenId)
        .then((res: string) => {
          setNFTOwner(res)
        })
        .catch((e: any) => setNFTOwner(null))
      // collectionContract.totalSupply().then((n: BigNumber) => setTotalSupply(n.toNumber()))
    }
  }, [collection.address, apiData?.tokenId])

  const data: NFTData & { isLoading: boolean; owner: string } = {
    ...safeDefaults,
    ...apiData,
    isLoading: isTokenDataLoading || isOffersLoading,
    owner,
    collection,
    offers: tokenOffers || [],
  }

  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // @ts-ignore
          return React.cloneElement(child, { data })
        }
        return null
      })}
    </>
  )
}
