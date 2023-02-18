export default async function getCoinGeckoDataOG(bal) {
    await fetch('https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0xfa1ba18067ac6884fb26e329e60273488a247fc3')
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