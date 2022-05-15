import React from "react"
import { NFTData } from "../types"
import { Wrap, WrapItem, Stat, StatNumber, StatLabel, Heading, Box, Skeleton } from "@chakra-ui/react"

export default function NFTAttributes({ data, ...props }: { data: NFTData & { isLoading: boolean }; props?: object }) {
  return (
    <Box mt={2} {...props}>
      <Heading fontSize={"lg"}>Traits</Heading>
      <Wrap spacing={"6px"} mt={4} minH={200}>
        {data.isLoading ? (
          <>
            <Skeleton h={14} w={20} borderRadius={"lg"} />
            <Skeleton h={14} w={40} borderRadius={"lg"} />
            <Skeleton h={14} w={20} borderRadius={"lg"} />
            <Skeleton h={14} w={35} borderRadius={"lg"} />
            <Skeleton h={14} w={36} borderRadius={"lg"} />
            <Skeleton h={14} w={20} borderRadius={"lg"} />
            <Skeleton h={14} w={20} borderRadius={"lg"} />
          </>
        ) : (
          data.attributes?.map(attr => (
            <WrapItem key={attr.traitType} borderRadius={"lg"} bg={"#cbe8ff"} p={2}>
              <Stat size={"sm"}>
                <StatLabel fontSize={10}>{attr.traitType}</StatLabel>
                <StatNumber>{attr.value || "None"}</StatNumber>
              </Stat>
            </WrapItem>
          ))
        )}
      </Wrap>
    </Box>
  )
}
