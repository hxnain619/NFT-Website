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

  const featuredNFTs = ["0x0949183501aA67a77fb009b46e8D7F07a3520352"];

  useEffect(() => {
    if (mainnet) {
      Promise.all([getFeaturedChainNft(featuredNFTs[1], "Avalanche")]).then((data) => {
        handleSetState({ NFTs: [...data.flat()] });
      });
    } else {
      Promise.all([getAllNftsbyChain("Avalanche", 10)]).then((data) => {
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
        <GenadropCarouselScreen cardWidth={286} gap={32} init={init}>
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
