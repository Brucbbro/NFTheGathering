import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Badge, Box, Text, Heading, Flex, Center, Divider } from "@chakra-ui/react"
import { LROrder, NFTData } from "../types"
import { WethIcon } from "./Icons/WethIcon"
import { formatEther } from "ethers/lib/utils"
import { StrategyAnyItemFromCollectionForFixedPrice } from "../constants"
import WalletAddress from "./WalletAddress"

dayjs.extend(relativeTime)

function excludeExpired(offer: LROrder) {
  // for some reason even querying for "VALID" offers can return expired ones
  return offer.endTime.valueOf() * 1000 > new Date().valueOf()
}

export default function NFTOffers({ data }: { data: NFTData }) {
  const orders: LROrder[] = data?.offers || []
  return (
    <Box mt={10} w={"100%"}>
      <Heading fontSize={"md"} mb={5}>
        Top offers on LooksRare
      </Heading>
      {orders.length === 0 ? (
        <Center>
          <Text textAlign={"center"}>None</Text>
        </Center>
      ) : (
        orders
          .filter(excludeExpired)
          .slice(0, 5)
          .map((order, index) => (
            <>
              <Flex key={index} justifyContent={"space-between"} minH={8}>
                <Text flex={1}>
                  <Text fontSize={"x-small"} as={"span"} mr={1}>
                    From
                  </Text>
                  <WalletAddress addr={order.signer} />
                </Text>
                <Text flex={1}>
                  <WethIcon />
                  {parseFloat(formatEther(order.price)).toFixed(2)}
                  {
                    <Badge colorScheme={"green"} ml={1} fontSize={"xx-small"} variant={"outline"}>
                      {order.strategy.toLowerCase() === StrategyAnyItemFromCollectionForFixedPrice
                        ? "collection"
                        : "offer"}
                    </Badge>
                  }
                </Text>
                <Text flex={1}>
                  <Text fontSize={"x-small"} as={"span"} mr={1}>
                    expires
                  </Text>
                  {dayjs(order.endTime.valueOf() * 1000).fromNow()}
                </Text>
              </Flex>
              {index < 9 && <Divider />}
            </>
          ))
      )}
    </Box>
  )
}
