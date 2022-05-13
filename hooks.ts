import { useQuery, UseQueryResult } from "react-query"
import { request, gql } from "graphql-request"
import axios from "axios"
import { ethers } from "ethers"
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

export function useNFTTokenData(collectionAddr: string, tokenId: string) {
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
              collection {
                name
                symbol
                type
                isVerified
                totalSupply
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
    },
  )
}

export function useCollectionData(collectionAddr: string) {
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
    },
  )
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

export function useTokenOffers(collectionAddr: string, tokenId: string) {
  return useQuery<LROrder[] | null>(
    ["orders", "offers", collectionAddr, tokenId],
    async () => {
      const tokenResponse = await rateLimitedAxios.get(REST_ENDPOINT + "orders", {
        params: {
          collection: collectionAddr,
          status: ["VALID"],
          isOrderAsk: false,
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
      return [...collectionResponse.data.data, ...tokenResponse.data.data] as LROrder[]
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddr && !!tokenId,
    },
  )
}
