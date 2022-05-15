import { BigNumberish } from "ethers"

export interface NFTData {
  name: string
  description: string
  image: { src: string }
  tokenId: string
  attributes: { displayType: string; value: string; traitType: string }[]
  owner: string | null
  collection?: LRCollection & { stats?: LRCollStats }
  orders: LROrder[] | null
}

export interface LRToken {
  name: string
  tokenId: string
  description: string
  image: {
    src: string
  }
  collection?: {
    address: string
    owner: string
    name: string
    description: string
    symbol: string
    type: "ERC721" | "ERC1155"
    websiteLink: string
    facebookLink: string
    twitterLink: string
    instagramLink: string
    telegramLink: string
    mediumLink: string
    discordLink: string
    isVerified: boolean
    isExplicit: boolean
  }
  attributes: {
    traitType: string
    value: string
    displayType: string
  }[]
}

export interface LROrder {
  //taken from https://github.com/LooksRare/looksrare-sdk/blob/master/src/types/orders.ts
  isOrderAsk: boolean // true --> ask / false --> bid
  signer: string
  price: BigNumberish
  tokenId: BigNumberish
  minPercentageToAsk: BigNumberish
  params: any[]
  endTime: Date
  strategy: string
  status: "VALID" | "EXPIRED" | "CANCELLED" | "EXECUTED"
}

export interface LRCollection {
  address: string
  owner: string
  name: string
  description: string
  symbol: string
  type: "ERC721" | "ERC1155"
  isVerified: boolean
}

export interface LRCollStats {
  address: string
  countOwners: number
  totalSupply: number
  floorPrice: string
  floorChange24h: number
  floorChange7d: number
  floorChange30d: number
  marketCap: string
  volume24h: string
  average24h: string
  count24h: number
  change24h: number
  volume7d: string
  average7d: string
  count7d: number
  change7d: number
  volume1m: string
  average1m: string
  count1m: number
  change1m: number
  volume3m: string
  average3m: string
  count3m: number
  change3m: number
  volume6m: string
  average6m: string
  count6m: number
  change6m: number
  volume1y: string
  average1y: string
  count1y: number
  change1y: number
  volumeAll: string
  averageAll: string
  countAll: number
}
