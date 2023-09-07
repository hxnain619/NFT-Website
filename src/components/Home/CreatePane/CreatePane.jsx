/* eslint-disable react/no-array-index-key */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import homepageCreate from "../../../assets/images/hompage_create.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { getFeaturedChainNft } from "../../../renderless/fetch-data/fetchUserGraphData";
import classes from "./CreatePane.module.css";

const CreatePane = () => {
  const cardRef = useRef(null);

  const [state, setState] = useState({
    cardWidth: 0,
    singles: [],
  });

  const { singles } = state;
  useEffect(() => {}, []);
  const { mainnet } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    const cardWidth = cardRef.current && cardRef.current.getBoundingClientRect().width;
    handleSetState({ cardWidth });
  }, []);

  useEffect(() => {
    if (mainnet) {
      const goodIds = [
        "genadrop-contract.nftgen.near1664562603103",
        "0x5ce2deee9b495b5db2996c81c16005559393efb810815",
        "0x436aeceaeec57b38a17ebe71154832fb0faff87823108",
        "0x5ce2deee9b495b5db2996c81c16005559393efb8238140",
      ];
      Promise.all([
        getFeaturedChainNft(goodIds[1], "Avalanche"),
        getFeaturedChainNft(goodIds[2], "Avalanche"),
        getFeaturedChainNft(goodIds[3], "Avalanche"),
      ]).then((data) => {
        handleSetState({ singles: [...data.flat()] });
      });
    }
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.pane}>
        {" "}
        <div className={classes.left}>
          <img src={homepageCreate} alt="" />
        </div>
        <div className={classes.right}>
          <div className={classes.heading}>CREATE YOUR OWN NFT</div>
          <div className={classes.description}>
            Turn anything into a digital collectible you own with no code in minutes. Create all types of NFTs,
            automatically indexed in our marketplace. Showcase your talent to a global audience and unlock doors to
            collaborations, commissions, and exciting opportunities.
          </div>
          <Link to="/create">
            <div className={classes.btn}>Create Now</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePane;
