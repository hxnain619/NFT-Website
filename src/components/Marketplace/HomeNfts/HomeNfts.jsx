import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./HomeNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import { getFeaturedChainNft, getAllNftsbyChain } from "../../../renderless/fetch-data/fetchUserGraphData";
import { Link } from "react-router-dom";

const HomeNfts = () => {
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
        getFeaturedPolygonNfts(featuredNFTs[6], "Avalanche"),
      ]).then((data) => {
        handleSetState({ NFTs: [...data.flat()] });
      });
    } else {
      Promise.all([getAllNftsbyChain(4, "Avalanche")]).then((data) => {
        handleSetState({ NFTs: [...data.flat()] });
      });
    }
  }, []);

  useEffect(() => {
    if (NFTs.length > 0) handleSetState({ ready: true });
  }, [NFTs]);
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.headingContainer}>
          <div className={classes.heading}>FEATURED NFTs </div>
          <div>Notable NFTs that were easily created on the Planform</div>
          <div>
            <Link to="/marketplace">
              <div className={classes.btn}>View All</div>
            </Link>
          </div>
        </div>

        <div className={`${classes.wrapper}`}>
          {ready ? (
            <div className={classes.nfts}>
              {NFTs.length > 0 ? (
                NFTs.map((collection) => <SingleNftCard key={collection.Id} nft={collection} />)
              ) : !NFTs ? (
                <NotFound />
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className={classes.skeletonWrapper}>
              {[...new Array(4)]
                .map((_, idx) => idx)
                .map((id) => (
                  <div className={classes.skeleton} key={id}>
                    <Skeleton count={1} height={250} />
                    <Skeleton count={1} height={20} />
                    <Skeleton count={1} height={20} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeNfts;
