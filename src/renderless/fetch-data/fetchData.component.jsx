/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { useContext, useEffect } from "react";
import { EVM_CHAINS } from "../../constant/chain";
import {
  setAvalancheCollections,
  setAvalancheSingleNfts,
  setNotification,
  setPolygonCollections,
  setPolygonSingleNfts,
  setSearchContainer,
} from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { GET_GRAPH_COLLECTIONS, GET_SINGLE_NFTS } from "../../graphql/querries/getCollections";
import { getGraphCollections, getSingleGraphNfts } from "../../utils";
import { getSingleMinterAddress } from "../../utils/address";
import { isMainNet } from "../../utils/chain";
import { avalancheClient, polygonClient } from "../../utils/graphqlClient";
import { parseAvaxSingle, parsePolygonCollection, parsePolygonSingle } from "./fetchData-script";

const FetchData = () => {
  const { dispatch, mainnet } = useContext(GenContext);
  useEffect(() => {
    // Get Polygon Collections
    (async function getPolygonCollections() {
      dispatch(setPolygonCollections(null));

      const { data, error } = await polygonClient.query(GET_GRAPH_COLLECTIONS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getGraphCollections(data?.collections);

      const filterAddress = getSingleMinterAddress(EVM_CHAINS.Polygon, isMainNet);

      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        // dispatch(setPolygonCollections(res));
        dispatch(
          setSearchContainer({
            "Polygon collection": parsePolygonCollection(res),
          })
        );
      } else {
        dispatch(setPolygonCollections(null));
      }
      return null;
    })();

    // Get Polygon Signle NFTs
    (async function getPolygonSingleNfts() {
      dispatch(setPolygonSingleNfts(null));

      const { data, error } = await polygonClient.query(GET_SINGLE_NFTS("Polygon", 0, false)).toPromise();
      const { data: sbData, error: sbError } = await polygonClient
        .query(GET_SINGLE_NFTS("Polygon", 0, true))
        .toPromise();
      if (error || sbError) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getSingleGraphNfts([...data.nfts, ...sbData.nfts]);
      if (result?.length) {
        // dispatch(setPolygonSingleNfts(result));
        dispatch(
          setSearchContainer({
            "Polygon 1of1": parsePolygonSingle(result),
          })
        );
      } else {
        dispatch(setPolygonSingleNfts(null));
      }
      return null;
    })();

    // Get Avalanche Collections
    (async function getAvalancheCollections() {
      dispatch(setAvalancheCollections(null));

      const { data, error } = await avalancheClient.query(GET_GRAPH_COLLECTIONS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getGraphCollections(data?.collections);
      const filterAddress = getSingleMinterAddress(EVM_CHAINS.Avalanche, isMainNet);

      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        // dispatch(setPolygonCollections(res));
        dispatch(
          setSearchContainer({
            "Polygon collection": parsePolygonCollection(res),
          })
        );
      } else {
        dispatch(setPolygonCollections(null));
      }
      return null;
    })();

    // Avalanche Single Nfts
    (async function getAvalancheSingleNfts() {
      dispatch(setAvalancheSingleNfts(null));

      const { data, error } = await avalancheClient.query(GET_SINGLE_NFTS("Avalanche", 0, false)).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getSingleGraphNfts(data?.nfts);
      if (result) {
        // dispatch(setAvaxSingleNfts(result));
        dispatch(
          setSearchContainer({
            "Avax 1of1": parseAvaxSingle(result),
          })
        );
      } else {
        dispatch(setAvaxSingleNfts(null));
      }
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
