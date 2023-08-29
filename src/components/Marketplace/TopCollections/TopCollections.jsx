/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./TopCollections.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import ChainDropdown from "../Chain-dropdown/chainDropdown";
import { getCollectionsByCategory, getCollectionsByChain, sortBy } from "../../../pages/Marketplace/Marketplace-script";
import { setActiveCollection } from "../../../gen-state/gen.actions";
import NotFound from "../../not-found/notFound";
import { getAllChainCollections, getAllNftsbyChain } from "../../../renderless/fetch-data/fetchUserGraphData";
import { Link } from "react-router-dom";

const AllNfts = () => {
  const history = useHistory();
  const [state, setState] = useState({
    activeType: "T1",
    activeChain: "All Chains",
    activeCategory: "All",
    filteredCollection: [],
    collections: [],
    singles: [],
    newest: [],
    load: true,
  });

  const { activeType, activeChain, activeCategory, collections, singles, newest, filteredCollection, load } = state;
  const { mainnet, dispatch } = useContext(GenContext);

  const categories = [
    "All",
    "Vibe",
    "Sesh",
    "Photography",
    "Shorts",
    "Doubletake",
    "Digital Graphic",
    "Painting",
    "Illustration",
    "3D",
    "Video",
    "Audio",
    "Tweet",
    "AI",
  ];
  const type = {
    T1: newest,
    T2: singles,
    T3: collections,
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleChainChange = (chain) => {
    handleSetState({
      load: true,
    });
    const result = getCollectionsByChain({ collections: type[activeType], chain, mainnet });
    handleSetState({ filteredCollection: result || [], activeChain: chain });
    handleSetState({ load: false });
  };

  useEffect(() => {
    Promise.all([getAllChainCollections("Avalanche"), getAllChainCollections("Polygon")]).then((data) => {
      const filteredData = sortBy({ collections: data.flat(), value: "Newest" });
      console.log("collections", filteredData);
      handleSetState({ collections: filteredData });
      handleSetState({ load: false });
    });
  }, []);

  useEffect(() => {
    dispatch(setActiveCollection(null));
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.headingContainer}>
          <div className={classes.heading}>TOP COLLECTIONS</div>
          <div>
            <Link to="/marketplace">
              <div className={classes.btn}>View All</div>
            </Link>
          </div>
        </div>
        {collections?.length > 0 && !load ? (
          <section className={classes.nfts}>
            {collections.slice(0, 4).map((collection, idx) => (
              <CollectionNftCard key={idx} collection={collection} />
            ))}
          </section>
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(4)].map((id, idx) => (
              <div key={idx}>
                <Skeleton count={1} height={200} />
                <Skeleton count={1} height={20} />
                <Skeleton count={1} height={20} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNfts;
