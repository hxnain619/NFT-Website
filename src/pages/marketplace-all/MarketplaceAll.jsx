/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import CollectionNftCard from "../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import NotFound from "../../components/not-found/notFound";
import Search from "../../components/Search/Search";
import SkeletonCards from "../../components/skeleton-card";
import { GenContext } from "../../gen-state/gen.context";
import { getAllChainCollections, getAllNftsbyChain } from "../../renderless/fetch-data/fetchUserGraphData";
import {
  filterBy,
  getCollectionsByChain,
  getCollectionsByDate,
  rangeBy,
  sortBy,
} from "../Marketplace/Marketplace-script";
import classes from "./MarketplaceAll.module.css";

import GlowCircle from "../../components/glow-circle/GlowCircle";
import { EVM_CHAINS } from "../../constant/chain";

const MarketplaceAll = () => {
  const { mainnet, dispatch } = useContext(GenContext);
  const mountRef = useRef(0);
  const [isLoading, setLoading] = useState(false);
  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    chainData: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    activeDate: 0,
    searchValue: "",
    notFound: false,
    searchChain: "All Chains",
  });

  const {
    collections,
    activeDate,
    paginate,
    currentPage,
    chainData,
    currentPageValue,
    filteredCollection,
    notFound,
    searchChain,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllNftsbyChain(EVM_CHAINS.Avalanche, 10),
      getAllNftsbyChain(EVM_CHAINS.Polygon, 10),
      getAllNftsbyChain(EVM_CHAINS.Ethereum, 10),
      getAllChainCollections(EVM_CHAINS.Avalanche, 10),
      getAllChainCollections(EVM_CHAINS.Polygon, 10),
      getAllChainCollections(EVM_CHAINS.Ethereum, 10),
    ]).then((data) => {
      const filteredData = sortBy({ collections: data.flat(), value: "Newest" });
      handleSetState({ collections: filteredData, filteredCollection: filteredData });
      setLoading(false);
    });
  }, []);

  // Pagination
  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };
  // const params = new URLSearchParams(location.search);
  // const activeSwitch = (active) => {
  //   params.set("tab", active);
  //   history.push({
  //     pathname: location.pathname,
  //     search: params.toString(),
  //   });
  //   handleSetState({ activeDate: active });
  // };

  // useEffect(() => {
  //   const active = params.get("tab");
  //   if (active) {
  //     handleSetState({ activeDate: active });
  //   } else {
  //     activeSwitch(activeDate);
  //   }
  // }, []);

  // Date Filter
  const handleDateSort = (date) => {
    // activeSwitch(date);
    const tempCollection = getCollectionsByChain({ collections, chain: searchChain, mainnet });

    const result = getCollectionsByDate({ collections: tempCollection, date });
    handleSetState({ activeDate: date, filteredCollection: result });
  };

  // Chain Filter
  const handleChainChange = (chain) => {
    const tempCollection = getCollectionsByDate({ collections, date: activeDate });

    const result = getCollectionsByChain({ collections: tempCollection, chain, mainnet });
    handleSetState({ filteredCollection: result, searchChain: chain, chainData: result });
  };

  const handleFilter = async ({ type, value }) => {
    if (type === "sort") {
      const result = sortBy({ collections: chainData, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      const result = await rangeBy({ collections: chainData, value });
      handleSetState({ filteredCollection: result });
    }
    if (type === "status") {
      const result = filterBy({ collections: chainData, value });
      handleSetState({ filteredCollection: result });
    }
  };

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(filteredCollection.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = filteredCollection.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [filteredCollection]);

  useEffect(() => {
    if (mountRef.current > 2) {
      handleSetState({ notFound: !Object.keys(paginate).length });
    }
    mountRef.current += 1;
  }, [paginate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.title}>
          <h1>{searchChain}</h1>
          <p>View all minted {filteredCollection.length ? `(${filteredCollection.length} minted)` : "(...)"}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <Search searchPlaceholder="Search By collections, 1of1s or Users" type="" />

          <div className={classes.filter}>
            <div className={classes.chainDesktop}>
              <ChainDropdown onChainFilter={handleChainChange} data={collections} />
            </div>
            <FilterDropdown handleFilter={handleFilter} />
          </div>
        </div>
        <div className={classes.chainMobile}>
          <ChainDropdown onChainFilter={handleChainChange} />
        </div>
        <div className={classes.dateFilter}>
          <div onClick={() => handleDateSort(1)} className={`${classes.date} ${activeDate === 1 && classes.active}`}>
            24 Hours
          </div>
          <div onClick={() => handleDateSort(7)} className={`${classes.date} ${activeDate === 7 && classes.active}`}>
            7 Days
          </div>
          <div onClick={() => handleDateSort(30)} className={`${classes.date} ${activeDate === 30 && classes.active}`}>
            30 Days
          </div>
          <div onClick={() => handleDateSort(0)} className={`${classes.date} ${activeDate === 0 && classes.active}`}>
            All
          </div>
        </div>

        <GlowCircle />
      </div>
      <div className={classes.wrapper}>
        {Object.keys(paginate).length ? (
          <div className={classes.nfts}>
            {paginate[currentPage].map((collection, idx) => {
              return collection?.nfts ? (
                <CollectionNftCard key={idx} collection={collection} />
              ) : (
                <SingleNftCard key={idx} nft={collection} />
              );
            })}
          </div>
        ) : !notFound && isLoading ? (
          <div className={classes.nfts}>
            <SkeletonCards cardsLength={8} customSize={[200, 40]} />
          </div>
        ) : (
          <NotFound />
        )}
      </div>
      {Object.keys(paginate).length ? (
        <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...state, handleSetState }} />
      ) : null}
    </div>
  );
};

export default MarketplaceAll;
