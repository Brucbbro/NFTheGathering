import React from "react"
import { Text, Center, Flex, Link, Spacer } from "@chakra-ui/react"
import WalletConnectButton from "./WalletConnectButton"
export default function Header() {
  return (
    <Flex w={"100%"} px={4} py={2} bg={"#cbe8ff"}>
      <Center>
        <Link href={"/"} _hover={{ textDecoration: "none" }}>
          <Text as={"span"} fontSize={"xl"}>
            NFT
          </Text>
          <Text as="span" fontSize={"sm"}>
            heGathering
          </Text>
        </Link>
      </Center>
      <Spacer />
      <Center>
        <WalletConnectButton />
      </Center>
    </Flex>
  )
}
