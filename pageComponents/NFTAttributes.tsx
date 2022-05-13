import React from "react"
import { NFTData } from "../types"
import { Wrap, WrapItem, Stat, StatNumber, StatLabel, Heading, Box } from "@chakra-ui/react"

export default function NFTAttributes({ data, ...props }: { data: NFTData; props: object }) {
  return (
    <Box mt={2} {...props}>
      <Heading fontSize={"lg"}>Traits</Heading>
      <Wrap spacing={"6px"} mt={4}>
        {data?.attributes.map(attr => (
          <WrapItem key={attr.traitType} borderWidth={"1ox"} borderRadius={"lg"} bg={"#cbe8ff"} p={2}>
            <Stat size={"sm"}>
              <StatLabel fontSize={10}>{attr.traitType}</StatLabel>
              <StatNumber>{attr.value || "None"}</StatNumber>
            </Stat>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
}
