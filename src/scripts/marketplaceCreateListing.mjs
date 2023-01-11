//This is incomplete

/*const marketplace = useMarketplace(
    "0x68BafA6Db476b8d6Da1D249BFe0e054d610FC6eb", // Your marketplace contract address here
  );
// data is the active listings, isLoading is a loading flag while we load the listings.
const { data: listings, isLoading: loadingListings } =
  useActiveListings(marketplace);



// Data of the listing you want to create
const listing = {
    // address of the NFT contract the asset you want to list is on
    assetContractAddress: "0x68BafA6Db476b8d6Da1D249BFe0e054d610FC6eb",
    // token ID of the asset you want to list
    tokenId: "0",
   // when should the listing open up for offers
    startTimestamp: new Date(),
    // how long the listing will be open for
    listingDurationInSeconds: 86400,
    // how many of the asset you want to list
    quantity: 1,
    // address of the currency contract that will be used to pay for the listing
    // BUSD: 0xe9e7cea3dedca5984780bafc599bd69add087d56
    // BNB: 0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9
    currencyContractAddress: '0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9',
    // how much the asset will be sold for
    buyoutPricePerToken: "0.0001",
  }
  
  const tx = await marketplace.direct.createListing(listing);
  const receipt = tx.receipt; // the transaction receipt
  const listingId = tx.id; // the id of the newly created listing*/
  
  // And on the buyers side:
  // Quantity of the asset you want to buy
  // const quantityDesired = 1;
  // await contract.direct.buyoutListing(listingId, quantityDesired);