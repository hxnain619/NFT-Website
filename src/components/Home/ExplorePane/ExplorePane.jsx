/* eslint-disable react/no-array-index-key */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./ExplorePane.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { getFeaturedChainNft } from "../../../renderless/fetch-data/fetchUserGraphData";
import chains from "../../../components/Marketplace/Chains/Chains-Script";
import GenadropCarouselCard from "../../../components/Genadrop-Carousel-Card/GenadropCarouselCard";

const ExplorePane = () => {
  const cardRef = useRef(null);
  const history = useHistory();

  const [state, setState] = useState({
    cardWidth: 0,
  });

  const { cardWidth } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleClick = (name, isComingSoon) => {
    if (isComingSoon) return;
    history.push(`marketplace/all?chain=${name}`);
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect();
    handleSetState({ cardWidth });
  }, []);

  const handlePreview = (chain, Id) => {
    if (chain) {
      history.push(`/marketplace/1of1/${chain}/${Id}`);
    } else {
      history.push(`/marketplace/1of1/${Id}`);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.pane}>
        <div className={classes.leftpane}>
          <div className={classes.heading}>BROWSE BY BLOCKCHAIN</div>
          <div className={classes.description}>
            Turn anything into a digital collectible you own with no code in minutes. Create all types of NFTs,
            automatically indexed in our marketplace. Showcase your talent to a global audience and unlock doors to
            collaborations, commissions, and exciting opportunities.
          </div>
          <Link to="/marketplace">
            <div className={classes.btn}>Explore Now</div>
          </Link>
        </div>
        <div className={classes.rightpane}>
          <GenadropCarouselCard cardWidth={cardWidth} gap={20}>
            {chains.map((chain, idx) => {
              return (
                chain.isChain && (
                  <div
                    onClick={() => handleClick(chain.name, chain.isComingSoon)}
                    style={{ background: chain.bg, borderColor: chain.border }}
                    key={idx}
                    ref={cardRef}
                    className={`${classes.card} ${chain.isComingSoon && classes.inActive}`}
                  >
                    <img src={chain.icon} alt="" />
                    <div style={{ color: chain.color, fontWeight: 700, fontSize: 16 }}>{chain.label}</div>
                    {chain.isComingSoon ? (
                      <div style={{ color: chain.color }} className={classes.soon}>
                        coming soon
                      </div>
                    ) : null}
                  </div>
                )
              );
            })}
          </GenadropCarouselCard>
        </div>
      </div>
    </div>
  );
};

export default ExplorePane;
