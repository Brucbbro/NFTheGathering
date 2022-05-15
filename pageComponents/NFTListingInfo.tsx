import React from "react"
import { Text } from "@chakra-ui/react"
import { WethIcon } from "./Icons/WethIcon"

export default function NFTListingInfo({ listingPrice }: { listingPrice: string | null }) {
  return listingPrice === null ? (
    <Text as={"span"}>Unlisted</Text>
  ) : (
    <>
      Listed for
      <Text as={"span"} color={"initial"}>
        &nbsp;{listingPrice} <WethIcon />
      </Text>
    </>
  )
}
