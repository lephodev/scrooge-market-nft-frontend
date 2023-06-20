export default async function getCoinGeckoDataOG(bal) {
    await fetch(
        `https://api.coinbrain.com/public/coin-info`,{
          method: "post",
        body:JSON.stringify({
          "56":[process.env.REACT_APP_OGCONTRACT_ADDRESS]
        })})
        .then((response) => response.json())
        .then((data) => {
            const current_price = data[0].priceUsd;
            return current_price;
        })
        .catch((e) => {
          console.log(e);
          return false;
        });
  };