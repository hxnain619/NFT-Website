import { useState, useEffect, useCallback } from "react";
import useHandleCollection from "./useHandleCollection";

function useFetchCollectionData(page) {
  console.log(`[useFetchCollectionData.js]`);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listNFT, setListNFT] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);

  const handleCollection = useHandleCollection();

  const amountOnPage = 50;

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      handleCollection
        .getTokenList(
          process.env.REACT_APP_COMMUNITY_COLLECTION_ADDRESS,
          amountOnPage,
          page
        )
        .then((res) => {
          if (res?.data) {
            setListNFT((prev) => [
              ...prev?.map((item) => {
                return { ...item, tokenId: item?.tokenID };
              }),
              ...res?.data?.map((item) => {
                return { ...item, tokenId: item?.tokenID };
              }),
            ]);
            setTotalAmount(res?.total);
          }
        });
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sendQuery();
  }, [sendQuery, page]); // eslint-disable-line react-hooks/exhaustive-deps

  return { loading, error, listNFT, totalAmount };
}

export default useFetchCollectionData;
