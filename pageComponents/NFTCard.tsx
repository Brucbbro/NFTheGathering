import React from "react"
import { useWalletStore } from "../stateManagement"
import { BigNumber, ethers } from "ethers"
import _ from "lodash"
import {
  Center,
  Wrap,
  Image,
  Text,
  HStack,
  Flex,
  Tooltip,
  Box,
  Spacer,
  chakra,
  LinkOverlay,
  Fade,
  Spinner,
} from "@chakra-ui/react"
import { WethIcon } from "./Icons/WethIcon"
import { NFTData } from "../types"
import { formatEther } from "ethers/lib/utils"

const insetStyle = {
  boxShadow: "0 0 1px 1px rgba(0,0,0,0.4) inset, 0 0 3px 1px rgba(0,0,0,0.4)",
  border: "2.5px solid rgba(100,100,100,0.6)",
}

const TextFrame = (props: any) => (
  <Box
    {...props}
    style={{
      borderRadius: "18px/40px",
      // border: "1px solid rgba(0,0,0)",
      backgroundColor: "rgba(255,255,255,0.7)",
      padding: "1px 5px",
      width: "106%",
      transform: "translateX(-3%)",
      ...insetStyle,
      boxShadow: "0 0 1px 1px rgba(0,0,0,0.4) inset, 0 0 5px 1px rgba(0,0,0,0.4) inset, 0 0 3px 1px rgba(0,0,0,0.4)",
    }}
  />
)

const ManaCircle = ({ style = {}, digits = 1, ...props }) => (
  <Center
    {...props}
    style={{
      ...style,
      fontWeight: "500",
      fontSize: `${16 / Math.sqrt(digits)}px`,
      borderRadius: "50%",
      marginLeft: 3,
      height: 17,
      width: 17,
      boxShadow: "-0.2px 1px black",
      backgroundColor: "#e1e1e1",
    }}
  />
)

function priceToRarity(collectionFloorPrice: number, tokenAskPrice: number) {
  const floorAskRatio = tokenAskPrice / collectionFloorPrice
  if (floorAskRatio <= 1.1) {
    return 0 //common
  } else if (floorAskRatio <= 1.25) {
    return 1 //uncommon
  } else if (floorAskRatio <= 1.55) {
    return 2 //rare
  } else if (floorAskRatio > 1.55) {
    return 3 //mythic
  }
}

const RarityBadge = ({ label = "", rarity = 0 }) => {
  const rarityStyleMapping = [
    {
      WebkitTextStroke: "0.5px #ccc",
      color: "#000",
    },
    {
      background: "-webkit-linear-gradient(0deg,#4b4b4b,#9a9a9a,#4b4b4b)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      WebkitTextStroke: "0.7px #111",
      color: "#4b4b4b",
    },
    {
      background: "-webkit-linear-gradient(0deg,#655125,#bba269,#655125)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      WebkitTextStroke: "0.7px #111",

      color: "#655125",
    },
    {
      background: "-webkit-linear-gradient(45deg,#be3402,#e1948c,#be3402)",

      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      WebkitTextStroke: "0.7px #111",
      color: "#be3402",
    },
  ]
  return (
    <Text
      style={{
        fontWeight: "bold",
        fontSize: "14px",
        ...rarityStyleMapping[rarity],
      }}
    >
      {label}
    </Text>
  )
}
export default function NFTCard({ data, style }: { style?: object; data: NFTData & { isLoading: boolean } }) {
  /*
  For a very naive way of determining a card rarity/value I'll check how much its price differs
  from the collection floor. Could get it from websites like rarity.sniper but the client is already making quite
  a number of requests: it would be better done server side / with a cloud function and possibly with a cache layer.
   */
  const highestTokenOffer = data.offers?.length ? data.offers.at(-1) : null
  const floorPrice = parseFloat(formatEther(data.collection?.stats?.floorPrice || 0))
  const estimatedValue = highestTokenOffer
    ? parseFloat(formatEther(highestTokenOffer.price)) *
      (1 + ethers.BigNumber.from(highestTokenOffer.minPercentageToAsk).div(100000).toNumber())
    : floorPrice

  const attributesTakeUpTooMuchSpace =
    data.attributes.map(a => a.value).join(",").length > 92 || data.attributes.length > 7
  return data.isLoading ? (
    <Flex
      p={3}
      borderRadius={"md"}
      direction={"column"}
      style={{
        ...style,
        border: "1px solid dimgray",
        width: 300,
        height: 440,
        boxShadow: "1px 1px 4px 2px rgba(0,0,0,0.3)",
        zIndex: 0,
      }}
      bg={"black"}
      position={"relative"}
      overflow={"hidden"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Spinner size={"xl"} />
    </Flex>
  ) : (
    <Fade in={true}>
      <Flex
        p={3}
        borderRadius={"md"}
        direction={"column"}
        style={{
          ...style,
          border: "1px solid dimgray",
          width: 300,
          height: 440,
          boxShadow: "1px 1px 4px 2px rgba(0,0,0,0.3)",
          zIndex: 0,
        }}
        bg={"black"}
        position={"relative"}
        overflow={"hidden"}
      >
        <Image
          fit="cover"
          style={{ position: "absolute", height: 440, width: 300, zIndex: -1, filter: "blur(4px)", opacity: 0.8 }}
          src={data.image?.src}
          alt={`${data.name} image`}
        />
        <TextFrame>
          <Flex>
            <Center>
              {" "}
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {data.isLoading ? "Loading..." : data.name}
              </Text>
            </Center>
            <Spacer />
            <Center>
              {highestTokenOffer && Math.round(estimatedValue) > 0 && (
                <ManaCircle digits={String(Math.round(estimatedValue)).length}>
                  <Text>{Math.round(estimatedValue)}</Text>
                </ManaCircle>
              )}
              <ManaCircle>
                <WethIcon />
              </ManaCircle>
            </Center>
          </Flex>
        </TextFrame>
        <Center style={insetStyle} bg={"black"}>
          <Image
            width={"100%"}
            height={"186px"}
            style={{ objectFit: "cover" }}
            src={data.image?.src}
            alt={`${data.name} image`}
            fallbackSrc="/demo.png"
          />
        </Center>

        <TextFrame>
          <Flex>
            <Center>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                Token – {data?.collection?.type === "ERC1155" ? "Semi Fungible" : "Non Fungible"}
              </Text>
            </Center>
            <Spacer />
            <Center>
              <Tooltip label={data?.collection?.name}>
                <RarityBadge label={data?.collection?.symbol} rarity={priceToRarity(floorPrice, estimatedValue)} />
              </Tooltip>
            </Center>
          </Flex>
        </TextFrame>
        <Box bg={"rgba(255,255,255,0.7)"} p={2} h={"141"} maxH={"141"} style={insetStyle}>
          <Flex direction={"column"} justifyContent={"space-between"} h={"100%"}>
            <Box>
              <Text noOfLines={5}>
                {data.attributes?.map(
                  (attr, index) =>
                    attr.value !== "" && (
                      <React.Fragment key={attr.traitType}>
                        <Text as={"span"} fontSize={"sm"} fontWeight={"bold"}>
                          {attr.displayType === "number" && attr.traitType + " "}
                          {attr.value}
                        </Text>
                        {index != data.attributes.length - 1 && ", "}
                      </React.Fragment>
                    ),
                )}
              </Text>
            </Box>
            <Spacer />
            {!attributesTakeUpTooMuchSpace && (
              <Box overflow={"hidden"}>
                <Text fontFamily={"serif"} fontSize={"12px"} as={"i"} noOfLines={3}>
                  {data.description}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
        <Flex
          bg={"black"}
          color={"#ccc"}
          fontSize={"8px"}
          py={1}
          px={2}
          h={"26px"}
          fontWeight={"bolder"}
          borderBottomRadius={"sm"}
          position={"relative"}
          justifyContent={"space-between"}
        >
          <Text flex={1}>
            {_.padStart(data.tokenId, String(data.totalSupply).length, "0")}/{data.totalSupply}
          </Text>

          <Center
            mt={"-15px"}
            width={"35px"}
            height={"20px"}
            borderRadius={"50%"}
            p={2}
            bg={"black"}
            // top={"40%"}
            // left={"50%"}
            // transform={"translate(-50%,-50%)"}
            style={insetStyle}
          >
            <Tooltip
              title={
                data?.collection?.isVerified
                  ? "Verified on LooksRare"
                  : "This collection is not yet verified on LooksRare"
              }
            >
              <span>
                <LinkOverlay
                  href={`https://looksrare.org/collections/${data.collection?.address}/${data.tokenId}`}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  {data?.collection?.isVerified ? <span>✔</span> : <span>✖</span>}
                </LinkOverlay>
              </span>
            </Tooltip>
          </Center>
          <Flex textAlign={"right"} direction={"column"} flex={1}>
            <Text>™ & ® Brucabbro</Text>
            <Text fontSize={"6px"}>(WOTC don&lsquo;t sue me pls)</Text>
          </Flex>
        </Flex>
      </Flex>
    </Fade>
  )
}
