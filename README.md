#NFTheGathering

###A fun approach at mixing up a small test, NFTs and MTG

The whole project is bootstrapped using `npx create-next-app --ts` and revolves around two pages: a landing page on `/` and a token detail page at `/{collection}/{tokenId}`

To satisfy the "best case scenario" requirements, the stack used is:
`react`, `nextjs`, `ethers`, `react-query`, `graphql`, `axios` & `chakra-ui`.


This test was time constrained so some programming choices were made out of need, others out of preference:

- **`Zustand` for global state management** - Adding a whole library just to handle the connected wallet address might be overkill, but I find its API so clear and has a relatively small footprint. I very much prefer it over the built-in `Context`, both because it's not just useful to avoid prop drilling in some instances, but it can also scale to be used a global state management system, especially if the app is not particularly complex. Lastly, I like that I can keep out of the render a bit more when manging with app state, unlike a Context that requires a `Context.Provider`.


- **`ethers`** - The very much welcome lightweight alternative to `web3.js`, especially client-side. 
  - The way it's been used on this project it's to showcase how it works with a simple `abi`, assuming it will interact with `ERC721` & `ERC1155` only, it's in a read-only flavour, depending on the `window.ethereum` object injected by browser wallet extensions. This comes with the drawback that browsers without such extension can't query the blockchain for token ownership, implying that a different approach should be used in a production app. 
  Usually third party services provide this information through their APIs, and I'm sure this applies to LooksRare as well. 
  - A simple alternative could have been implementing an `/api/token/{tokenId}/owner` endpoint to fallback to in case the client can't query the blockchain itself. It hasn't been done mainly because it would have required more time, but also because it would have meant either hard-coding a project secret / secret key, which whould have been a pretty bad look IMO even in the scope of a test, or doing it properly with environment variables. This latter option would have you inputting a secret key in a `.env` file or during the run command, and I wanted this project to be runnable simply by cloning it and issuing `yarn dev` to remove any kind of friction. 


- **`GraphQL and REST` endpoints** - Given that `apollo` disables introspection in production I couldn't get the schema: apart for some guesswork around the obvious similarities expected between REST and GraphQL endpoints, namely `token.collection` and `token.attributes`, I decided that sticking to the "known" information as much as possible was the more professional approach. I was already querying the `GET /collections/` and `GET /collections/stats` endpoints regardless, so I took `collection` out of the graphQL query. Couldn't help keeping `attributes` though, it was too useful there to build some UI upon. Everything related to endpoints was implemented as hooks, in the boringly named `hooks.ts` file. In real sized projects I had queries logically organized in separate files, imported in a file called `networking` or something, in this project they're the only custom hooks, so I think the poor file name could be passable.


- **`NFTCard.tsx`** is the messiest file, mostly because of 
  - **quite a bunch of `css-in-js` in it** - Admittedly it was most due to the multiple tweaks I had to do to get closer to how I wanted the look-and-feel to be, and not being confident enough with `chakra-ui` or `emotion` I often resorted to the quick and dirty css-in-js to get there. My go-to approach nowadays would be using `tailwindcss` as I'm aware of the drawbacks of creating a new `style` object every render.
  
  - **multiple components defined within a single file** All these components are defined as `const` functions, few lines short, and are utility/presentational components to distinguish them from the plain utility `function priceToRarity()`, while the main one is a `function` and obviously the only exported one. This stems from the fact that JavaScript used to have a harder time inferring function names while displaying errors -at least in the past-. I'm not sure if it's nextjs, a newer version of React, node or the browsers, but I'm pretty sure it's not the case anymore. I stuck to it though, because I think it gives a clearer hierarchy and a bit more "room" for messiness before splitting components in multiple files is needed, as they are logically bound together.



###Another note on **`Components` structure**
Over time I try and get components as logically organized as possible, and in some case I managed to do so in time, like in `/pages/[collection][tokenId].tsx` `Line 117`


``` tsx
<NFTAttributes data={nftData} />
<NFTOffers data={nftData} />
```

as opposed to `Lines 100-111 ` 
``` tsx
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

```

which could have probably been moved to an `NFTOwnerInfo`, especially if the component kept growing.