import React from "react"
import type { NextPage } from "next"
import Image from "next/image"

import Page from "../pageComponents/Page"
import { Container, Button, Flex, Heading, Link, Text, Wrap, WrapItem, VStack, Box } from "@chakra-ui/react"

const Home: NextPage = () => {
  return (
    <Page>
      <Container>
        <VStack spacing={10}>
          <Box>
            <Heading>Welcome to NFThe Gathering</Heading>
            <Text> Watch your favourite collection turn into a Magic: The Gathering™ card set.</Text>
          </Box>
          <Box minH={300} w={"100%"}>
            <Image
              priority
              alt={"example results"}
              src="/demo.png"
              layout={"responsive"}
              width={"100%"}
              height={"100%"}
              objectFit={"contain"}
            />
          </Box>
          <Box>
            <Text fontSize={"lg"} mb={4}>
              Check out some example collections or edit the page URL
            </Text>
            <Wrap>
              <WrapItem>
                <Link href={"/0xe785E82358879F061BC3dcAC6f0444462D4b5330/6990"}>
                  <Button colorScheme={"purple"}>World Of Women</Button>
                </Link>
              </WrapItem>
              <WrapItem>
                <Link href={"/0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258/46769"}>
                  <Button colorScheme={"blue"}>Otherdeed</Button>
                </Link>
              </WrapItem>

              <WrapItem>
                <Link href={"/0x716F29B8972D551294d9E02B3eb0fC1107FbF4aA/6990"}>
                  <Button colorScheme={"teal"}>Imaginary Ones</Button>
                </Link>
              </WrapItem>
            </Wrap>
          </Box>
        </VStack>
      </Container>
    </Page>
  )
}

export default Home
