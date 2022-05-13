import React from "react"
import type { NextPage } from "next"
import NFTCard from "../../pageComponents/NFTCard"
import { useCollectionData, useCollectionStats } from "../../hooks"
import { useRouter } from "next/router"
import Page from "../../pageComponents/Page"
import { ethers } from "ethers"
import { WethIcon } from "../../pageComponents/Icons/WethIcon"
import { Button, Text, Heading, Kbd, Flex, Spacer, Box, Skeleton } from "@chakra-ui/react"
import NFTDataProvider from "../../pageComponents/NFTDataProvider"
import NFTAttributes from "../../pageComponents/NFTAttributes"
import NFTOffers from "../../pageComponents/NFTOffers"
import WalletAddress from "../../pageComponents/WalletAddress"
import { NFTData } from "../../types"
import useNFTData from "../../pageComponents/NFTDataProvider"

const Home: NextPage = () => {
  const router = useRouter()
  const { collection, tokenId } = router.query
  const [currentTokenId, setCurrentTokenId] = React.useState<string>(tokenId as string)
  const tokenIdAsNumber = parseFloat(currentTokenId as string)
  const maxSupply = 100000

  React.useEffect(() => {
    document.addEventListener("keydown", keyPressHandler)
    return () => document.removeEventListener("keydown", keyPressHandler)
  }, [keyPressHandler])

  React.useEffect(() => {
    setCurrentTokenId(tokenId as string)
  }, [tokenId])

  function keyPressHandler(e: KeyboardEvent) {
    if (e.key == "ArrowRight") {
      nextNFT()
    } else if (e.key == "ArrowLeft") {
      prevNFT()
    }
  }

  function nextNFT() {
    const nextId = tokenIdAsNumber + 1 >= maxSupply ? 1 : tokenIdAsNumber + 1
    goToTokenId(nextId)
  }

  function prevNFT() {
    const prevId = tokenIdAsNumber > 0 ? tokenIdAsNumber - 1 : maxSupply - 1
    goToTokenId(prevId)
  }

  function goToTokenId(id: number) {
    router.push(
      {
        pathname: `/${collection}/${id}`,
      },
      undefined,
      { shallow: true },
    )
  }
  const { data: collStats, isLoading: isStatsLoading } = useCollectionStats(collection as string)
  const { data: collData, isLoading: isCollLoading, error: collError } = useCollectionData(collection as string)
  const nftData = useNFTData({ collection: { ...collData, stats: collStats || null }, tokenId: currentTokenId })



  return (
    <Page>
      {collStats && (
        <span>
          {!isCollLoading && <Text fontSize={"sm"}>{collData?.name}</Text>}
          <Text color={"dimgray"} fontSize={"xs"}>
            floor:{" "}
            <Text as={"span"} color={"initial"}>
              {ethers.utils.formatEther(collStats?.floorPrice || 0)} <WethIcon />
            </Text>
            unique owners:{" "}
            <Text as={"span"} color={"initial"}>
              {((collStats.countOwners / collStats.totalSupply) * 100).toFixed(2)}%
            </Text>
          </Text>
        </span>
      )}
      <Text>
        <Heading as={"span"}>#{currentTokenId}</Heading>
        <Text as={"span"}>
          Owner: <WalletAddress addr={nftData.owner || ""} />
        </Text>
      </Text>
      <Flex position={"relative"} m={2} direction="row" flexWrap={"wrap"} justifyContent={"space-evenly"}>
        {collection && currentTokenId && (
          <>
            <Flex direction={"column"} w={350}>
              <NFTCard data={nftData} />
              <Flex alignItems={"center"} my={4}>
                <Button w="24" onClick={prevNFT}>
                  Previous
                </Button>{" "}
                <Text fontSize={"xs"} m={2}>
                  or
                </Text>
                <Kbd mr={4}>⬅</Kbd>
                <Kbd ml={4}>➡</Kbd>{" "}
                <Text fontSize={"xs"} m={2}>
                  or
                </Text>
                <Button w="24" onClick={nextNFT}>
                  Next
                </Button>
              </Flex>
            </Flex>
          </>
        )}
        {!collection || !currentTokenId ? (
          <Skeleton flex={1} />
        ) : (
          <Flex direction={"column"} w={"md"}>
            <NFTAttributes data={nftData} />
            <NFTOffers data={nftData} />
          </Flex>
        )}
      </Flex>
    </Page>
  )
}

export default Home
