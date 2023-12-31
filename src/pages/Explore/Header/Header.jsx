/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bannerImg from "../../../assets/explore-banner2.svg";
import discordIcon from "../../../assets/icon-discord-blue.svg";
import listIcon from "../../../assets/icon-list.svg";
import stackIcon from "../../../assets/icon-stack.svg";
import tradeIcon from "../../../assets/icon-trade.svg";
import globe from "../../../assets/globe.png";
import plane from "../../../assets/plane.png";
import instagram from "../../../assets/instagram.png";
import share from "../../../assets/share.png";
import twitter from "../../../assets/twitter.png";
import twitterIcon from "../../../assets/icon-twitter-blue.svg";
import avalanche from "../../../assets/icon-avalanche-red.png";
import Copy from "../../../components/copy/copy";
import { breakAddress } from "../../../components/wallet/wallet-script";
import { getFormatedPrice } from "../../../utils";
import { readUserProfile } from "../../../utils/firebase";
import supportedChains from "../../../utils/supportedChains";
import classes from "./Header.module.css";

const linkIcons = {
  discord: discordIcon,
  twitter: twitterIcon,
};

const Header = ({ collection, getHeight }) => {
  const { name, owner, description, nfts, image_url, chain, price } = collection;
  const volumeTraded = 0;
  const domMountRef = useRef(false);
  const headerRef = useRef(null);
  const [state, setState] = useState({
    usdValue: 0,
    UsdVolumeValue: 0,
    user: null,
    links: [
      {
        icon: twitter,
      },
      {
        icon: globe,
      },
      {
        icon: plane,
      },
      {
        icon: instagram,
      },
      {
        icon: share,
      },
    ],
  });

  const { usdValue, UsdVolumeValue, user, links } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);
    handleSetState({ usdValue: Number(value) * Number(price), UsdVolumeValue: Number(volumeTraded) * Number(price) });
  };

  const getUser = async () => {
    const user = await readUserProfile(owner);
    const links = [];
    const link = {};
    if (user?.twitter) {
      link.url = `https://twitter.com/${user.twitter}`;
      link.icon = linkIcons.twitter;
      links.push(link);
    } else if (links?.discord) {
      link.url = `https://discord.com/users/${user.discord}`;
      link.icon = linkIcons.discord;
      links.push(link);
    }
    handleSetState({ user, links });
  };

  useEffect(() => {
    // getUsdValue();
    getUser();
  }, [collection]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (domMountRef.current) {
        const res = headerRef.current?.getBoundingClientRect().height;
        getHeight(res + 100);
      } else {
        domMountRef.current = true;
      }
    });
    getHeight(400);
  }, []);

  if (!collection) return null;

  return (
    <div ref={headerRef} className={classes.container}>
      <div
        // style={{ backgroundImage: `url(${bannerImg})` }}
        className={classes.innerContainer}
      >
        <div className={classes.wrapper}>
          <img className={classes.thumbnail} src={image_url} alt="" />
          <div className={classes.linksAndCollectionDetailWrapper}>
            <div className={classes.collectionDetail}>
              <div className={classes.nameAndChainWrapper}>
                <div className={classes.name}>{name}</div>
                {/* <img className={classes.chain} src={supportedChains[chain]?.icon} alt="" /> */}
              </div>
              <div className={classes.creator}>
                <p>by</p>
                <div className={classes.accent}>
                  <Link to={`/profile/${chain}/${owner}`}> {(user && user.username) || breakAddress(owner)}</Link>{" "}
                  {/* <Copy message={owner} /> */}
                </div>
              </div>
            </div>

            {/* <div className={classes.socialLinks}>
              {links.map((link, idx) => (
                <a key={idx} className={classes.link} href={link.url}>
                  <img src={link.icon} alt="" />
                </a>
              ))}
            </div>   */}
          </div>
        </div>
      </div>

      <div className={classes.innerContainer_2}>
        <div className={classes.wrapper_2}>
          <div className={classes.collectionDescription}>
            <p>
              Collection 1234 created for creative people to own the NFT they desire. Creative people and geometry.{" "}
              <br /> Collection 1234 created for creative people to own the NFT they desire...
            </p>
          </div>
          <div className={classes.socialLinks}>
            {links.map((link, idx) => (
              <a key={idx} className={classes.link} href={link.url}>
                <img src={link.icon} alt="" />
              </a>
            ))}
          </div>
          <div className={classes.description}>{description}</div>
          <div className={classes.statsContainer}>
            <div className={classes.statWrapper}>
              {/* <img src={listIcon} alt="" /> */}
              <div className={classes.details}>
                <div className={classes._2}>
                  <span className={classes.statsAccent}>{nfts?.length ?? 0}</span>
                </div>
                <div className={classes._1}>Total NFT</div>
              </div>
            </div>
            <div className={classes.statWrapper}>
              {/* <img src={stackIcon} alt="" /> */}
              <div className={classes.details}>
                <div className={classes._2}>
                  {/* <span className={classes.accent}>{Number(price).toFixed(4)}</span>{" "} */}
                  {/* <span className={classes.accent}>{supportedChains[chain].symbol}</span>{" "} */}
                  <img src={avalanche} alt="avalanche" />
                  <span>{`${usdValue.toFixed(1)}`}</span>
                </div>
                <div className={classes._1}>Floor Price</div>
              </div>
            </div>

            <div className={classes.statWrapper}>
              {/* <img src={tradeIcon} alt="" /> */}
              <div className={classes.details}>
                <div className={classes._2}>
                  {/* <span className={classes.accent}>{volumeTraded}</span>{" "}
                  <span className={classes.accent}>{supportedChains[chain].symbol}</span>{" "} */}
                  <img src={avalanche} alt="avalanche" />
                  <span>{`${UsdVolumeValue}`}</span>
                </div>
                <div className={classes._1}>Total Volume Traded</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
