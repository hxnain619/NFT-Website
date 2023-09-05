import CollectionApi from "../../api/CollectionApi";

export default function useHandleCollection() {
  const getTokenList = (contractAddress, limit, page) => {
    console.log(`[useHandleCollection.js::getTokenList]`);

    return new CollectionApi()
      .getTokenList(contractAddress, limit, page)
      .then((res) => (res?.status ? res?.data || {} : {}));
  };

  const getOneToken = (contractAddress, tokenID) => {
    console.log(`[useHandleCollection.js::getOneToken]`);

    return new CollectionApi()
      .getOneToken(contractAddress, tokenID)
      .then((res) => (res?.status ? res?.data || {} : {}));
  };

  const checkToken = (contractAddress, tokenID) => {
    console.log(`[useHandleCollection.js::checkToken]`);

    return new CollectionApi().checkToken(contractAddress, tokenID).then((res) => {
      return res?.status ? res?.data?._doc || {} : {};
    });
  };

  const getCollectionStatistics = (contractAddress) => {
    console.log(`[useHandleCollection.js::getCollectionStatistics]`);

    return new CollectionApi().getCollectionStatistics(contractAddress).then((res) => {
      return res?.status ? res?.data || {} : {};
    });
  };

  return {
    getTokenList,
    getOneToken,
    checkToken,
    getCollectionStatistics,
  };
}
