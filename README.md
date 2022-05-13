

Some choices only make sense in the context of a "test", 
for example check if an NFT is owned by the current wallet
it's easy to do with ethers.js and it's done to show some understanding
of how a smart contract ABI works, but it's pretty slow and therefore has
a subpar UX.


On a production app I'd like to use some indexing service, like moralis.io o some internal one, to get all wallet-owned NFTs at once and store them in memory/localStorage.