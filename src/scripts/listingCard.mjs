import { useContract, useActiveListings } from "@thirdweb-dev/react";

export default function ListingCard({ name, description, image, price, id }) {
    const { contract } = useContract("0x68BafA6Db476b8d6Da1D249BFe0e054d610FC6eb", "marketplace")
    // data is the active listings, isLoading is a loading flag while we load the listings.
    const { data: listings, isLoading: loadingListings } =
      useActiveListings(contract);

  const buyAsset = async () => {
    try {
      await listings.buyoutListing(id, 1);
      alert("Asset purchased successfully");

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error purchasing asset");
    }
  };

  return (
    <div className="listingCard">
      <div className="listingCard__container">
        <img className="listingCard__image" src={image} />
        <div className="listingCard__innerContainer">
          <div className="listingCard__name">{name}</div>
          <div className="listingCard__description">{description}</div>
          <div>{price / 1e18}</div>
        </div>
      </div>
      <button className="listingCard__button" onClick={buyAsset}>
        Buy now!
      </button>
    </div>
  );
};