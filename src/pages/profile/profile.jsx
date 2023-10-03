import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { readUserProfile } from "../../utils/firebase";
import { handleCancel, handleImageUpload, handleInputChange, handleSave } from "./profile-script";
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
  const [isEnableuserName, setIsEnableuserName] = useState(false);
  const [enableDisableButtons, setEnableDisableButtons] = useState(false);
  const profileRef = useRef(null);

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

  const [isBanner, setIsBanner] = useState(false);

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

  const handleUserImageChange = (event) => {
    handleImageUpload(event, dispatch, handleSetState, setEnableDisableButtons, isBanner ? "bannerUrl" : "imgUrl");
  };

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
        {bannerUrl != "" ? <img src={bannerUrl} alt="" /> : <></>}
        <div
          className={bannerUrl == "" ? "" : "add-image-container"}
          onClick={() => {
            profileRef.current.click();
            setIsBanner(true);
          }}
        >
          <BannerImg />
          <p>Upload banner image</p>
          <p>(recommended size 1728*160 px)</p>
        </div>
      </div>
      <div className="user-container">
        <div className="user-image">
          <img src={imgUrl != "" ? ProfileImg : imgUrl} alt="" />
          <div
            className="add-image-container"
            onClick={() => {
              profileRef.current.click();
              setIsBanner(false);
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
              onChange={handleUserImageChange}
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
