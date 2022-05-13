import React from "react"
import Header from "./Header"
import { Flex, Container, VStack } from "@chakra-ui/react"

//@ts-ignore
export default function Page({ children }) {
  return (
    <VStack w="100%" h="100vh">
      <Header />
      {children}
    </VStack>
  )
}
