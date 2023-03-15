export default async function getCoinGeckoDataOG(bal) {
    await fetch(`https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${process.env.REACT_APP_OGCONTRACT_ADDRESS}`)
      .then(response => response.json())
      .then((data) => {
          const current_price = data.market_data.current_price.usd;
          return current_price;
      })
      .catch((e) => {
          console.log(e);
          return false;
      });
  };