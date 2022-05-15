import { QueryObserverSuccessResult, useQuery, UseQueryResult } from "react-query"
import { request, gql } from "graphql-request"
import axios from "axios"
import { BigNumber, ethers } from "ethers"
import rateLimit from "axios-rate-limit"
import {
  GRAPHQL_ENDPOINT,
  REST_ENDPOINT,
  StrategyAnyItemFromCollectionForFixedPrice,
  StrategyStandardSaleForFixedPrice,
  WETH_ADDRESS,
} from "./constants"
import { LRCollection, LRCollStats, LROrder, LRToken } from "./types"

const rateLimitedAxios = rateLimit(axios.create(), { maxRequests: 60, perMilliseconds: 60, maxRPS: 3 })

/*
REMINDME: At the time of writing useQuery incorrectly assigns result types
(treats every field as optional even when initialData is supplied)
The typecast on return its not really safe and should be removed once this
https://github.com/tannerlinsley/react-query/pull/3557
gets merged
 */

export function useNFTTokenData(collectionAddr: string, tokenId: string) {
  const initialData: LRToken = {
    attributes: [],
    description: "",
    image: { src: "" },
    name: "",
    tokenId: "",
  }
  return useQuery<LRToken>(
    ["token", collectionAddr, tokenId],
    async () => {
      const { token: data } = await request(
        GRAPHQL_ENDPOINT,
        gql`
          query GetToken($collection: Address!, $tokenId: String!) {
            token(collection: $collection, tokenId: $tokenId) {
              tokenId
              name
              description
              image {
                src
              }
              attributes {
                displayType
                traitType
                value
              }
            }
          }
        `,
        { collection: collectionAddr, tokenId },
      )
      return data
    },
    {
      retry: 2,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddr && !!tokenId,
      initialData,
    },
  ) as QueryObserverSuccessResult<LRToken, never>
}

export function useCollectionData(collectionAddr: string) {
  const initialData: LRCollection = {
    address: "",
    description: "",
    isVerified: false,
    name: "",
    owner: "",
    symbol: "",
    type: "ERC721",
  }
  return useQuery<LRCollection>(
    ["info", collectionAddr],
    async () => {
      const response = await rateLimitedAxios.get(REST_ENDPOINT + "collections", {
        params: { address: collectionAddr },
      })
      return response.data.data
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddr,
      initialData: initialData,
    },
  ) as QueryObserverSuccessResult<LRCollection, never>
}

export function useCollectionStats(collectionAddr: string) {
  return useQuery<LRCollStats>(
    ["stats", collectionAddr],
    async () => {
      const response = await rateLimitedAxios.get(REST_ENDPOINT + "collections/stats", {
        params: { address: collectionAddr },
      })
      return response.data.data
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddr,
    },
  )
}

export function useTokenOrders(collectionAddr: string, tokenId: string) {
  return useQuery<LROrder[] | null>(
    ["orders", "offers", collectionAddr, tokenId],
    async () => {
      const tokenResponse = await rateLimitedAxios.get(REST_ENDPOINT + "orders", {
        params: {
          collection: collectionAddr,
          status: ["VALID"],
          // isOrderAsk: false,
          currency: WETH_ADDRESS,
          sort: "PRICE_DESC",
          strategy: StrategyStandardSaleForFixedPrice,
          tokenId,
        },
      })
      const collectionResponse = await rateLimitedAxios.get(REST_ENDPOINT + "orders", {
        params: {
          collection: collectionAddr,
          status: ["VALID"],
          isOrderAsk: false,
          currency: WETH_ADDRESS,
          sort: "PRICE_DESC",
          strategy: StrategyAnyItemFromCollectionForFixedPrice,
        },
      })
      const mergeOrders = [...tokenResponse.data.data, ...collectionResponse.data.data]
      return mergeOrders.sort((a, b) => (BigNumber.from(a.price).gt(b.price) ? -1 : 1)) as LROrder[]
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddr && !!tokenId,
    },
  )
}
