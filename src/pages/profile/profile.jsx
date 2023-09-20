import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { readUserProfile } from "../../utils/firebase";
import { handleCancel, handleInputChange, handleSave } from "./profile-script";
import { ReactComponent as ArrowBack } from "../../assets/icon-arrow-left.svg";
import { ReactComponent as BannerImg } from "../../assets/images/image-icon.svg";
import { ReactComponent as EditIcon } from "../../assets/edit-icon.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icon-twitter-white.svg";
import { ReactComponent as InstaIcon } from "../../assets/icon-instagram-white.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icon-discord-white.svg";
import { ReactComponent as ClearIcon } from "../../assets/icon-close.svg";
import ProfileImg from "../../assets/ai-art-style/cartoonist.png";

import "./profile.css";
import { breakAddress } from "../NFT-Detail/NFTDetail-script";
import BackButton from "../../components/back-button/BackButton";

const Profile = () => {
  const history = useHistory();
  const { account, dispatch, chainId } = useContext(GenContext);

  const profileRef = useRef(null);

  const [state, setState] = useState({
    subscribe: false,
    username: "User Name",
    email: "",
    twitter: "",
    discord: "",
    instagram: "",
  });

  const [validation, setValidation] = useState({
    isEmail: true,
    isTwitter: true,
    isDiscord: true,
    isInstagram: true,
  });

  const { subscribe, email, twitter, discord, username, instagram } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleSetValidation = (payload) => {
    setValidation((val) => ({ ...val, ...payload }));
  };

  const inputProps = { handleSetState, handleSetValidation };
  const saveProps = { account, state, dispatch, handleSetValidation, history };
  const cancelProps = { handleSetState, history };

  useEffect(() => {
    (async function updateProfile() {
      if (!account) return;
      const res = await readUserProfile(account);
      handleSetState(res);
    })();
  }, [account]);

  return (
    <>
      <BackButton />
      <div className="container">
        {/* <Link to="#" className="back-btn" onClick={() => history.goBack()}>
          <ArrowBack /> Back
        </Link>{" "} */}
        <div className="heading-section">Profile Settings</div>
      </div>
      <div className="bg-cover">
        <BannerImg />
        <p>Upload banner image</p>
        <p>(recommended size 1728*160 px)</p>
      </div>
      <div className="user-container">
        <div className="user-image">
          <img src={ProfileImg} alt="" />
          <div className="add-image-container">
            <BannerImg />
            <br />
            Add Photo
            <input type="file" style={{ visibility: "hidden" }} id="inputTag" ref={profileRef} />
          </div>
        </div>
        <div className="image-title">
          <EditIcon />
          <span className="username-title">{username}</span>
          <br />
          <p>{breakAddress(account, 8)}</p>
        </div>

        <div className="social-section">
          <div>Add Socials</div>
          <div>
            {[
              {
                name: "twitter",
                icon: <TwitterIcon />,
                value: `https://twitter.com/${twitter}`,
              },
              {
                name: "instagram",
                icon: <InstaIcon />,
                value: `https://instagram.com/${instagram}`,
              },
              {
                name: "discord",
                icon: <DiscordIcon />,
                value: `https://discord.com/${discord}`,
              },
            ].map((social) => (
              <div className="text">
                {social.icon}
                <input
                  type="text"
                  value={social.value}
                  name={social.name}
                  onChange={(event) => handleInputChange({ event, ...inputProps })}
                />
                <ClearIcon />
              </div>
            ))}
          </div>
          <div className="social-btns">
            <button type="button" className="btn secondary-btn" onClick={() => handleCancel(cancelProps)}>
              Cancel
            </button>
            <button type="button" className="btn" onClick={() => handleSave(saveProps)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
