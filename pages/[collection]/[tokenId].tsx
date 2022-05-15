import React from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { Text, Heading, Kbd, Flex, Skeleton, Box, VStack } from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import { formatEther } from "ethers/lib/utils"

import { useCollectionData, useCollectionStats } from "../../hooks"
import NFTCard from "../../pageComponents/NFTCard"
import Page from "../../pageComponents/Page"
import NFTAttributes from "../../pageComponents/NFTAttributes"
import NFTOffers from "../../pageComponents/NFTOffers"
import WalletAddress from "../../pageComponents/WalletAddress"
import useNFTData from "../../pageComponents/NFTDataProvider"
import NFTCollectionSummary from "../../pageComponents/NFTCollectionSummary"
import NFTListingInfo from "../../pageComponents/NFTListingInfo"

const Home: NextPage = () => {
  const router = useRouter()
  const { collection, tokenId } = router.query
  const [currentTokenId, setCurrentTokenId] = React.useState<string>(tokenId as string)
  const tokenIdAsNumber = parseFloat(currentTokenId as string)

  const { data: collStats, isLoading: isStatsLoading } = useCollectionStats(collection as string)
  const { data: collData, isLoading: isCollLoading, error: collError } = useCollectionData(collection as string)
  const nftData = useNFTData({ collection: { ...collData, stats: collStats }, tokenId: currentTokenId })

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
    const nextId = tokenIdAsNumber + 1 >= (collStats?.totalSupply || 0) ? 1 : tokenIdAsNumber + 1
    goToTokenId(nextId)
  }

  function prevNFT() {
    const prevId = tokenIdAsNumber > 0 ? tokenIdAsNumber - 1 : (collStats?.totalSupply || 0) - 1
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

  const listedPrice =
    nftData.orders?.length && nftData.orders[0].isOrderAsk ? formatEther(nftData.orders[0].price) : null

  return (
    <Page>
      <Box mb={5} mt="0" mx={3} display="flex" flexDirection={"row"} alignSelf={"center"} alignItems={"center"}>
        <Kbd mr={4} onClick={prevNFT} _hover={{ cursor: "pointer" }}>
          <ArrowBackIcon />
        </Kbd>
        <Heading as={"span"} m={4}>
          #{currentTokenId}
        </Heading>
        <Kbd ml={4} onClick={nextNFT} _hover={{ cursor: "pointer" }}>
          <ArrowForwardIcon />
        </Kbd>{" "}
      </Box>
      <Flex
        position={"relative"}
        m={2}
        direction="row"
        flexWrap={"wrap"}
        justifyContent={"space-around"}
        alignItems={"flex-start"}
      >
        {collection && currentTokenId && (
          <Flex direction={"column"} px={[0, 14, 30]} py={4} justifyContent={"center"}>
            <NFTCard data={nftData} />
          </Flex>
        )}
        {!collection || !currentTokenId ? (
          <Skeleton flex={1} />
        ) : (
          <Flex direction={"column"} w={["xs", "sm", "lg"]} p={4}>
            <Flex justifyContent={"space-between"} alignItems={"flex-start"} mt={0} color={"gray"}>
              <VStack spacing={4} alignItems={"flex-start"}>
                {nftData.owner ? (
                  <Text as={"span"}>
                    Owned by
                    <Text color={"initial"} as={"span"}>
                      &nbsp;
                      <WalletAddress addr={nftData.owner || ""} />
                    </Text>
                  </Text>
                ) : (
                  <Box h={5} />
                )}
                <Text color={"gray"}>
                  {nftData.isLoading ? <Skeleton h={5} w={20} mr={4} /> : <NFTListingInfo listingPrice={listedPrice} />}
                </Text>
              </VStack>
              <NFTCollectionSummary collStats={collStats} isLoading={isCollLoading} collData={collData} />
            </Flex>
            <NFTAttributes data={nftData} />
            <NFTOffers data={nftData} />
          </Flex>
        )}
      </Flex>
    </Page>
  )
}

export default Home
