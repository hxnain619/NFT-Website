import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { readUserProfile } from "../../utils/firebase";
import { handleCancel, handleImageUpload, handleInputChange, handleSave } from "./profile-script";
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
  const [isEnableuserName, setIsEnableuserName] = useState(false);
  const [enableDisableButtons, setEnableDisableButtons] = useState(false);
  const profileRef = useRef(null);
  const bannerRef = useRef(null);

  const [state, setState] = useState({
    subscribe: false,
    username: "User Name",
    email: "",
    twitter: "",
    discord: "",
    instagram: "",
    imgUrl: "",
    bannerUrl: "",
  });

  const [validation, setValidation] = useState({
    isEmail: true,
    isTwitter: true,
    isDiscord: true,
    isInstagram: true,
  });

  const { subscribe, email, twitter, discord, username, instagram, imgUrl, bannerUrl } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleSetValidation = (payload) => {
    setValidation((val) => ({ ...val, ...payload }));
  };

  const inputProps = { handleSetState, handleSetValidation, setEnableDisableButtons };
  const saveProps = { account, state, dispatch, handleSetValidation, history, setIsEnableuserName };
  const cancelProps = { handleSetState, history, setEnableDisableButtons, account, setIsEnableuserName };

  useEffect(() => {
    (async function updateProfile() {
      if (!account) return;
      const res = await readUserProfile(account);
      handleSetState(res);
      setEnableDisableButtons(false);
    })();
  }, [account]);

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    handleSetState({ imgUrl: URL.createObjectURL(file) });
    handleImageUpload(file, dispatch, handleSetState, setEnableDisableButtons, "imgUrl");
  };
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    handleSetState({ bannerUrl: URL.createObjectURL(file) });
    handleImageUpload(file, dispatch, handleSetState, setEnableDisableButtons, "bannerUrl");
  };

  return (
    <>
      <BackButton />
      <div className="container">
        <div className="heading-section">Profile Settings</div>
      </div>
      <div className="bg-cover">
        {bannerUrl !== "" ? <img src={bannerUrl} alt="" /> : <></>}
        <div
          className="add-image-container"
          onClick={() => {
            bannerRef.current.click();
          }}
        >
          <BannerImg />
          <p>Upload banner image</p>
          <p>(recommended size 1728*160 px)</p>
          <input
            ref={bannerRef}
            type="file"
            style={{ visibility: "hidden" }}
            onChange={handleBannerUpload}
            id="bannerTag"
          />
        </div>
      </div>
      <div className="user-container">
        <div className="user-image">
          {imgUrl !== "" ? <img src={imgUrl} alt="" /> : <></>}
          <div
            className="add-image-container"
            onClick={() => {
              profileRef.current.click();
            }}
          >
            <BannerImg />
            <br />
            Add Photo
            <input
              type="file"
              style={{ visibility: "hidden" }}
              id="inputTag"
              ref={profileRef}
              onChange={handleProfileUpload}
            />
          </div>
        </div>
        <div className="image-title">
          <EditIcon onClick={() => setIsEnableuserName(true)} />
          <input
            className={`${isEnableuserName ? "input-active" : ""} username-title`}
            disabled={!isEnableuserName}
            name="username"
            onChange={(event) => handleInputChange({ event, ...inputProps })}
            type="text"
            value={username}
          />
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
              <div className="text" key={social.value}>
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
          {enableDisableButtons && (
            <div className="social-btns">
              <button type="button" className="btn secondary-btn" onClick={() => handleCancel(cancelProps)}>
                Cancel
              </button>
              <button type="button" className="btn primary-button" onClick={() => handleSave(saveProps)}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
