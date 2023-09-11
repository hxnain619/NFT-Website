/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./TopCollections.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { getCollectionsByChain, sortBy } from "../../../pages/Marketplace/Marketplace-script";
import { setActiveCollection } from "../../../gen-state/gen.actions";
import { getAllChainCollections } from "../../../renderless/fetch-data/fetchUserGraphData";
import SkeletonCards from "../../skeleton-card";

const AllNfts = () => {
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

  const { activeType, collections, singles, newest, load } = state;
  const { mainnet, dispatch } = useContext(GenContext);

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
          <SkeletonCards />
        )}
      </div>
    </div>
  );
};

export default AllNfts;
