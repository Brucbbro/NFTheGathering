import React from "react"
import { Box, Text } from "@chakra-ui/react"
import { ethers } from "ethers"
import { WethIcon } from "./Icons/WethIcon"
import { LRCollection, LRCollStats } from "../types"

export default function NFTCollectionSummary({
  collStats,
  isLoading,
  collData,
  ...props
}: {
  collStats?: LRCollStats
  isLoading: boolean
  collData: LRCollection
  props?: any
}) {
  return !collStats ? null : (
    <Box border={"1px solid"} borderColor={"lightblue"} p={2} borderRadius={4} {...props}>
      <Text fontSize={"x-small"} color={"lightblue"}>
        About this collection
      </Text>
      {!isLoading && <Text fontSize={"sm"}>{collData?.name}</Text>}
      <Text color={"dimgray"} fontSize={"xs"}>
        floor:{" "}
        <Text as={"span"} color={"initial"}>
          {ethers.utils.formatEther(collStats?.floorPrice || 0)}
          <WethIcon />
        </Text>
        &nbsp;unique owners:{" "}
        <Text as={"span"} color={"initial"}>
          {((collStats.countOwners / collStats.totalSupply) * 100).toFixed(2)}%
        </Text>
      </Text>
    </Box>
  )
}
