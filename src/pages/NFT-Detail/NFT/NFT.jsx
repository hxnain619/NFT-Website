/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { breakAddress } from "../NFTDetail-script";
import { ReactComponent as ShareIcon } from "../../../assets/icon-share.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/icon-refresh.svg";
import avatar from "../../../assets/avatar.png";
import "./NFT.css";

// import { ReactComponent as MoreIcon } from "../../../assets/icon-more.svg";

const NFT = ({ nftDetails }) => {
  const { name, image_url, owner } = nftDetails;
  const [share, setShare] = useState(false);
  const wrapperRef = useRef(null);
  const hanldeClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShare(false);
    }
  };

  const truncateText = (text, maxCharacters = 35) => {
    if (text?.length > maxCharacters) {
      return `${text.substring(0, maxCharacters)}...`;
    }
    return text;
  };

  useEffect(() => {
    if (share) {
      document.addEventListener("click", hanldeClickOutside, true);
      return () => document.removeEventListener("click", hanldeClickOutside, true);
    }
  }, [share]);

  return (
    <div className="image-section">
      <div className="heading">
        <div className="card-heading">{truncateText(name, 15)}</div>
        <div ref={wrapperRef}>
          <RefreshIcon /> &nbsp;
          <ShareIcon onClick={() => setShare(true)} />
        </div>
      </div>
      <div className="image-container">
        {nftDetails?.ipfs_data?.image_mimetype?.includes("video") || image_url.slice(-3) === "mp4" ? (
          <video className="image" src={image_url} alt="" controls />
        ) : nftDetails?.ipfs_data?.image_mimetype?.includes("audio") ? (
          <audio className="image" src={image_url} alt="" controls />
        ) : (
          <img className="image" src={image_url} alt="" />
        )}
      </div>
      <div className="image-section-description">
        {owner && (
          <>
            <div className="title">Created by:</div>
            <div>
              <img className="placeholder" src={avatar} alt="" />
              <Link to={`/profile/${nftDetails?.chain}/${owner}`}>{breakAddress(owner)}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NFT;
