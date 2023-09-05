import React, { useContext, useEffect, useState } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { getFeaturedChainNft, getAllNftsbyChain } from "../../../renderless/fetch-data/fetchUserGraphData";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import NotFound from "../../not-found/notFound";
import classes from "./FeaturedNfts.module.css";
import SkeletonCards from "../../skeleton-card";

const FeaturedNFTCards = () => {
  const { mainnet } = useContext(GenContext);

  const [state, setState] = useState({
    NFTs: [],
    init: false,
    ready: false,
  });

  const { NFTs, init, ready } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const featuredNFTs = [
    "genadrop-contract.nftgen.near1664562603103",
    "0x5ce2deee9b495b5db2996c81c16005559393efb810815",
    "0x436aeceaeec57b38a17ebe71154832fb0faff87823108",
    "0x5ce2deee9b495b5db2996c81c16005559393efb8238140",
    "0x5ce2deee9b495b5db2996c81c16005559393efb845339",
    "0x5ce2deee9b495b5db2996c81c16005559393efb812068",
    "0x436aeceaeec57b38a17ebe71154832fb0faff878160136",
  ];

  useEffect(() => {
    if (mainnet) {
      Promise.all([
        getFeaturedChainNft(featuredNFTs[1], "Avalanche"),
        getFeaturedChainNft(featuredNFTs[3], "Avalanche"),
        getFeaturedChainNft(featuredNFTs[4], "Avalanche"),
        getFeaturedChainNft(featuredNFTs[5], "Avalanche"),
        // getFeaturedPolygonNfts(featuredNFTs[6], "Avalanche"),
      ]).then((data) => {
        handleSetState({ NFTs: [...data.flat()] });
      });
    } else {
      Promise.all([getAllNftsbyChain(10, "Avalanche")]).then((data) => {
        handleSetState({ NFTs: [...data.flat()] });
      });
    }
  }, []);

  useEffect(() => {
    if (NFTs.length > 0) handleSetState({ ready: true });
  }, [NFTs]);

  return (
    <div className={`${classes.wrapper}`}>
      {ready ? (
        <GenadropCarouselScreen cardWidth={16 * 20} gap={32} init={init}>
          {NFTs.length > 0 ? (
            NFTs.map((collection) => <SingleNftCard use_width="20em" key={collection.Id} nft={collection} />)
          ) : !NFTs ? (
            <NotFound />
          ) : (
            ""
          )}
        </GenadropCarouselScreen>
      ) : (
        <SkeletonCards />
      )}
    </div>
  );
};

export default FeaturedNFTCards;
