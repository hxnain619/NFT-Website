import PriceApi from "../../api/PriceApi";

export default function useGetTokenPrice() {
  const getTokenPrice = async (selectedCurrency) => {
    console.log(`[useGetTokenPrice.js::getTokenPrice]`);
    const res = await new PriceApi().getPriceByCoingeckoId(
      selectedCurrency.coingecko_id
    );
    return {
      image: res.image.thumb,
      price: res.market_data.current_price.usd,
    };
  };

  return {
    getTokenPrice,
  };
}
