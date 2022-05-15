import React from "react"
import type { NextPage } from "next"
import Image from "next/image"

import Page from "../pageComponents/Page"
import { Container, Button, Flex, Heading, Link, Text, Wrap, WrapItem } from "@chakra-ui/react"

const Home: NextPage = () => {
  return (
    <Page>
      <Container>
        <Heading>Welcome to NFThe Gathering</Heading>
        <Text> Watch your favourite collection turn into a Magic: The Gathering™ card set.</Text>

        <Image
          alt={"example results"}
          src="/demo.png"
          layout={"responsive"}
          width={"100%"}
          height={"100%"}
          objectFit={"contain"}
        />

        <Text fontSize={"lg"}>Check out some example collections or type your own in the address bar</Text>
        <Wrap>
          <WrapItem>
            <Link href={"/0xe785E82358879F061BC3dcAC6f0444462D4b5330/6990"}>
              <Button>World Of Women</Button>
            </Link>
          </WrapItem>
          <WrapItem>
            <Link href={"/0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258/60084"}>
              <Button>Otherdeed</Button>
            </Link>
          </WrapItem>

          <WrapItem>
            <Link href={"/0x7d181baf4940c5666fe380248453e4678e6e6cb6/2"}>
              <Button>EtherFolds</Button>
            </Link>
          </WrapItem>
          <WrapItem>
            <Link href={"/0x716F29B8972D551294d9E02B3eb0fC1107FbF4aA/6990"}>
              <Button>Imaginary Ones</Button>
            </Link>
          </WrapItem>
        </Wrap>
      </Container>
    </Page>
  )
}

export default Home
