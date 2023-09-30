import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import moment from "moment";

import * as htmlToImage from "html-to-image";

import classes from "./minter.module.css";
// utils
import supportedChains from "../../../utils/supportedChains";
import { initConnectWallet } from "../../wallet/wallet-script";
import cards from "../Category/Category-script";
import { getBase64, getFileFromBase64, handleMint, handleSingleMint } from "./minter-script";
// assets
import { ReactComponent as Art } from "../../../assets/create/art-icon.svg";
import { ReactComponent as BorderIcon } from "../../../assets/create/border-icon.svg";
import rightArrow from "../../../assets/icon-arrow-right.svg";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-dropdown2.svg";
import { ReactComponent as GreenTickIcon } from "../../../assets/icon-green-tick.svg";
import { ReactComponent as VibesLogo } from "../../../assets/proof-of-vibes.svg";

// components
import GenadropToolTip from "../../Genadrop-Tooltip/GenadropTooltip";
import CollectionPreview from "../collection-preview/collectionPreview";
import Popup from "../popup/popup.component";
import ProfileImgOverlay from "../ProfileImgOverlay/ProfileImgOverlay";
import SliderInput from "./SliderInput";

import { setClipboard, setLoader, setMinter, setNotification, setOverlay } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import QrReaderContainer from "../../../pages/NFT-Detail/ImageModal/ImageModal";
import BackButton from "../../back-button/BackButton";
import IpfsImage from "../IpfsImage/IpfsImage";
import Tweeter from "../Tweeter/tweeter";

import PrimaryButton from "../../primary-button/PrimaryButton";
import SecondaryButton from "../../secondary-button/SecondaryButton";

const Minter = () => {
  const params = useParams();
  const browserLocation = useLocation();

  const history = useHistory();
  const tweetRef = useRef(null);

  const { dispatch, connector, account, chainId, mainnet, minter: minterFile } = useContext(GenContext);
  const [minter, setMinterObj] = useState(minterFile);

  // save file progress
  const loadedMinter = JSON.parse(sessionStorage.getItem("minter"));
  const { file, fileName: fName, metadata, zip } = minter;

  const [state, setState] = useState({
    tweet: "",
    aiData: "",
    ipfsLink: "",
    ipfsType: "",

    attributes: file?.length === 1 && metadata?.attributes ? metadata.attributes : {},
    category: metadata?.category ? metadata?.category : "",
    fileName: minter?.fileName,
    description: metadata?.length === 1 ? metadata[0].description : "",
    chain: null,
    preview: false,
    collectionProfile: "",
    toggleGuide: false,
    toggleDropdown: false,
    isSoulBound: false,
    toggleCategory: false,
    openQrModal: false,
    toggleType: false,
    previewSelectMode: false,
    profileSelected: false,
    popupProps: {
      imageSrc: null,
      url: null,
      isError: null,
      popup: false,
    },
    locationPermission: false,
    mintToMyAddress: true,
    receiverAddress: "",
    goodReceiverAddress: true,
    showLocation: false,
    vibeProps: {
      friendliness: 0,
      energy: 0,
      density: 0,
      diversity: 0,
    },
    location: "",
    fileExtension: "",
    stick_type: metadata?.smoking_stick ? metadata?.smoking_stick.value : "",
    header: "",
    hashtags: false,
    mentions: false,
    mintId: "",
  });

  const {
    attributes,
    aiData,
    fileName,
    description,
    chain,
    preview,
    collectionProfile,
    toggleGuide,
    previewSelectMode,
    profileSelected,
    isSoulBound,
    popupProps,
    mintToMyAddress,
    receiverAddress,
    goodReceiverAddress,
    category,
    toggleCategory,
    showLocation,
    openQrModal,
    vibeProps,
    toggleType,
    fileExtension,
    location,
    tweet,
    ipfsLink,
    ipfsType,
    stick_type,
    header,
    hashtags,
    mentions,
    mintId,
  } = state;

  const mintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    description,
    receiverAddress,
    account,
    chainId,
    connector,
    file: zip,
    fileName,
    mainnet,
    chain: chain?.chain,
  };

  const singleMintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    isAi: false,
    receiverAddress,
    account,
    chainId,
    isSoulBound,
    connector,
    file: file ? file[0] : {},
    metadata: {
      name: fileName,
      description,
      attributes: Object.values(attributes),
    },
    fileName,
    mainnet,
    chain: chain?.chain,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(async () => {
    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      handleSetState({ locationPermission: permission.state === "granted" });
    });
  }, []);

  const handleCloseQrModal = () => {
    handleSetState({ openQrModal: false });
  };

  useEffect(() => {
    if (params.mintId === "tweet") {
      const { data } = browserLocation?.state;
      handleSetState({
        tweet: JSON.parse(data),
        attributes: JSON.parse(data).attributes,
        description: tweet.text,
        fileName: tweet?.author_id?.name,
        mintId: params.mintId,
      });
    }

    if (params.mintId === "ai") {
      const { data } = browserLocation?.state;

      handleSetState({
        aiData: JSON.parse(data),
        attributes: JSON.parse(data).attributes,
        mintId: params.mintId,
        fileName: JSON.parse(data).title,
        isAi: true,
      });
    }

    if (params.mintId === "ipfs") {
      const { data, type } = browserLocation.state;
      handleSetState({ ipfsLink: data, ipfsType: type, mintId: params.mintId });
    }

    handleSetState({
      header: cards.filter(
        (card) =>
          card.value === category ||
          (card.value === "collection" && file?.length > 1) ||
          (card.value === "audio" && params.mintId === "Audio File" && !category) ||
          (card.value === "video" && params.mintId === "Video File" && !category) ||
          (card.value === "tweet" && params.mintId === "tweet" && !category) ||
          (card.value === "ipfs" && params.mintId === "ipfs" && !category) ||
          (card.value === "ai" && params.mintId === "ai" && !category) ||
          (card.value === "Art" &&
            file?.length === 1 &&
            !category &&
            params.mintId !== "Audio File" &&
            params.mintId !== "Video File")
      )[0],
    });
    if (file) {
      const filename = file[0].name.replace(/\.+\s*\./, ".").split(".");
      handleSetState({ fileExtension: filename.slice(filename.length - 1).join() });
    }
  }, [file]);

  useEffect(() => {
    if (category === "Sesh") {
      handleSetState({
        isSoulBound: true,
        attributes: {
          ...attributes,
          metadata: {
            trait_type: "Validator",
            value: account,
          },
        },
      });
    }
  }, [category]);
  useEffect(() => {
    if (category === "Sesh" && !receiverAddress) {
      handleSetState({ goodReceiverAddress: false });
    } else {
      handleSetState({ goodReceiverAddress: true });
    }
  }, [category]);

  useEffect(() => {
    if (minter) {
      Promise.all(Array.prototype.map.call(minter.file, getBase64))
        .then((urls) => {
          const newMinters = { ...minter, description, fileName, category, attributes, vibeProps, stick_type };
          newMinters.file = urls;

          sessionStorage.setItem("minter", JSON.stringify(newMinters));
        })
        .catch((error) => {
          console.log(error);
          // ...handle/report error...
        });
    } else if (params.mintId === "tweet") {
      handleSetState({ description: tweet.text });
    } else if (params.mintId === "ai") {
      return;
    } else {
      if (!loadedMinter) {
        return history.push("/create");
      }
      const files = loadedMinter.file.map((base64file) => {
        return getFileFromBase64(base64file.url, base64file.name);
      });

      loadedMinter.file = files;
      setMinterObj(loadedMinter);
      handleSetState({
        description: loadedMinter.description,
        fileName: loadedMinter.fileName,
        category: loadedMinter.category,
        attributes: loadedMinter.attributes,
        vibeProps: loadedMinter.vibeProps,
        stick_type: loadedMinter.stick_type,
      });
    }
    return null;
  }, [chain, showLocation, fileName]);

  const handleAddAttribute = () => {
    handleSetState({
      attributes: {
        ...attributes,
        [Date.now()]: { trait_type: "", value: "" },
      },
    });
  };

  const handleRemoveAttribute = (id) => {
    if (Object.keys(attributes).length === 1) return;

    const newAttributes = {};

    for (const key in attributes) {
      if (Number.parseInt(key) != id) {
        newAttributes[key] = attributes[key];
      }
    }

    handleSetState({ attributes: newAttributes });
  };

  const handleChangeAttribute = (arg) => {
    const {
      event: {
        target: { name, value },
      },
      id,
    } = arg;
    handleSetState({
      attributes: { ...attributes, [id]: { ...attributes[id], [name]: value } },
    });
  };

  const handleCancel = () => {
    dispatch(setMinter(null));
    history.push("/create");
  };

  const handleSetFileState = () => {
    console.log("handleSetFileState");
  };

  const changeFile = () => {
    history.push(`/create`);
  };

  const addHashtag = () => {
    if (tweet?.hashtags[0] !== null) {
      handleSetState({
        attributes: {
          ...attributes,
          6: {
            trait_type: "Hashtags",
            value: `#${[tweet?.hashtags[0]?.map((tag) => tag)].join(" #")}`,
          },
        },
        hashtags: true,
      });
    }
  };

  const addMentions = () => {
    if (tweet?.mentions[0] !== null) {
      handleSetState({
        attributes: {
          ...attributes,
          7: {
            trait_type: "Mentions",
            value: `#${[tweet?.mentions[0]?.map((tag) => tag)].join(" #")}`,
          },
        },
        mentions: true,
      });
    }
  };

  const removeHashtag = () => {
    if (tweet?.hashtags[0] === null) return;

    const newAttributes = {};
    for (const key in attributes) {
      if (Number.parseInt(key) != 6) {
        newAttributes[key] = attributes[key];
      }
    }

    handleSetState({ attributes: newAttributes, hashtags: false });
  };

  const removeMentions = () => {
    if (tweet?.mentions[0] === null) return;

    const newAttributes = {};
    for (const key in attributes) {
      if (Number.parseInt(key) != 7) {
        newAttributes[key] = attributes[key];
      }
    }

    handleSetState({ mentions: false, attributes: newAttributes });
  };

  const onMint = async () => {
    if (showLocation && location !== "") {
      handleSetState({
        attributes: {
          ...attributes,
          [Date.now()]: location,
        },
      });
    }

    if (tweet) {
      singleMintProps.file = await htmlToImage.toBlob(tweetRef.current);
    }

    if (mintId === "ai") {
      console.log("IN CAP", aiData);
      dispatch(setLoader("Getting image"));
      // const response = await axios.get(aiData.imageUrl, { responseType: 'blob' });
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/blob`,
        {
          imageUri: aiData.imageUrl,
          fileName: aiData.title,
        },
        {
          auth: {
            username: process.env.REACT_APP_USERNAME,
            password: process.env.REACT_APP_PASSWORD,
          },
        }
      );
      // const response = await fetch(`${process.env.REACT_APP_TWITTER_BACKEND}singleImage`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ uri: aiData.imageUrl }),
      // });
      const ui8A = new Uint8Array(Object.values(response.data.content));
      const blob = new File([ui8A], aiData.title, { type: "PNG" });
      singleMintProps.file = blob;
      dispatch(setLoader(""));
      singleMintProps.isAi = true;
      singleMintProps.fileName = aiData.title;
    }

    if (!(window.localStorage.walletconnect || chainId)) return initConnectWallet({ dispatch });

    if (!chainId) {
      return dispatch(
        setNotification({
          message: "connect your wallet and try again",
          type: "warning",
        })
      );
    }
    if (!goodReceiverAddress) {
      return dispatch(
        setNotification({
          message: "You must mint to a valid Address",
          type: "warning",
        })
      );
    }
    if (category === "Sesh" && receiverAddress === "") {
      return dispatch(
        setNotification({
          message: "You must mint to a valid Address",
          type: "warning",
        })
      );
    }
    if (!mintToMyAddress && receiverAddress.length < 42 && supportedChains[chainId].chain !== "Near") {
      return dispatch(
        setNotification({
          message: "Invalid receiver address",
          type: "warning",
        })
      );
    }
    if (!mintToMyAddress && receiverAddress.endsWith(".near") && !mainnet) {
      return dispatch(
        setNotification({
          message: "Invalid receiver address, You're currently on Testnet Network",
          type: "warning",
        })
      );
    }
    if (!mintToMyAddress && receiverAddress.endsWith(".testnet") && mainnet) {
      return dispatch(
        setNotification({
          message: "Invalid receiver address, you're currently on Mainnet Network",
          type: "warning",
        })
      );
    }
    if (receiverAddress.length >= 10 && !mintToMyAddress) {
      mintProps.receiverAddress = receiverAddress;
      singleMintProps.receiverAddress = receiverAddress;
    } else {
      mintProps.receiverAddress = account;
      singleMintProps.receiverAddress = account;
    }
    if (ipfsLink) {
      const { uploadType } = browserLocation.state;
      singleMintProps.file = ipfsLink;
      singleMintProps.fileName = `${singleMintProps.fileName}.${uploadType}`;
    }
    if (file?.length > 1) {
      if (!mintProps.description) {
        return dispatch(
          setNotification({
            message: "fill in the required fields",
            type: "warning",
          })
        );
      }
      dispatch(setOverlay(true));
      handleMint(mintProps).then((url) => {
        dispatch(setOverlay(false));
        if (typeof url === "object") {
          handleSetState({
            popupProps: {
              imageSrc: null,
              url: url.message,
              isError: true,
              popup: true,
            },
          });
        } else {
          sessionStorage.removeItem("minter");
          handleSetState({
            popupProps: {
              imageSrc: file[0],
              url,
              isError: false,
              popup: true,
            },
          });
        }
      });
    } else {
      if (!singleMintProps.fileName || !description) {
        return dispatch(
          setNotification({
            message: "fill out the missing fields",
            type: "warning",
          })
        );
      }

      if (ipfsLink && ipfsType) {
        singleMintProps.metadata.attributes.push({
          trait_type: "Category",
          value: ipfsType,
        });
      }

      if (category) {
        singleMintProps.metadata.attributes.push({
          trait_type: "Category",
          value: category,
        });
        if (category === "Sesh") {
          singleMintProps.metadata.attributes.push({
            trait_type: "smoking stick",
            value: stick_type,
          });
        } else if (category === "Vibe") {
          singleMintProps.metadata.attributes.push(
            {
              trait_type: "friendliness",
              value: vibeProps.friendliness,
            },
            {
              trait_type: "energy",
              value: vibeProps.energy,
            },
            {
              trait_type: "density",
              value: vibeProps.density,
            },
            {
              trait_type: "diversity",
              value: vibeProps.diversity,
            }
          );
        }
      }
      dispatch(setOverlay(true));
      handleSingleMint(singleMintProps).then((url) => {
        dispatch(setOverlay(false));
        if (typeof url === "object" && singleMintProps.chain.toLowerCase() !== "near") {
          handleSetState({
            popupProps: {
              imageSrc: null,
              url: url.message,
              isError: true,
              popup: true,
            },
          });
        } else {
          sessionStorage.removeItem("minter");
          handleSetState({
            popupProps: {
              imageSrc: file[0],
              url,
              isError: false,
              popup: true,
            },
          });
        }
      });
    }
  };

  // const handleConnectFromMint = (props) => {
  //   handleSetState({ toggleDropdown: false });
  //   dispatch(setToggleWalletPopup(true));
  //   dispatch(
  //     setConnectFromMint({
  //       chainId: props.networkId,
  //       isComingSoon: props.comingSoon,
  //     })
  //   );
  // };

  useEffect(() => {
    if (chainId) {
      handleSetState({ chain: supportedChains[chainId] });
    }
  }, [chainId]);

  const handleReceiverAddress = (e) => {
    handleSetState({ receiverAddress: e.target.value });
    if (
      e.target.value.length >= 42 ||
      (e.target.value.endsWith(".near") && mainnet) ||
      (e.target.value.endsWith(".testnet") && !mainnet)
    ) {
      handleSetState({ goodReceiverAddress: true });
    } else {
      handleSetState({ goodReceiverAddress: false });
    }
  };
  // select category
  const categories = [
    // "Sesh",
    // "Vibe",
    "Photography",
    "Painting",
    "Illustration",
    "3D",
    "Digital Graphic",
    // "Audio",
    // "Video",
  ];
  const stick_types = ["Blunt", "Joint", "Spliff", "Hashish", "Bong", "Cigarette", "Cigar"];
  const audioExtensions = ["mp3", "aac", "wav"];
  const videoExtensions = ["mp4", "m4v", "mov", "mkv", "avi", "webm", "flv"];

  const getActivetitle = () => {
    return (
      <div className={classes.headerText}>
        <div className={classes.headerIcon}>{header?.icon}</div>
        {header?.title}
      </div>
    );
  };

  const handleCheck = () => {
    const mintToMe = !mintToMyAddress;
    handleSetState({ mintToMyAddress: mintToMe });
    if (!mintToMe) handleSetState({ goodReceiverAddress: false, receiverAddress: "" });
    else handleSetState({ goodReceiverAddress: true });
  };

  const handleCheckSoulBound = () => {
    handleSetState({ isSoulBound: !isSoulBound });
  };

  // *************** GET CURRENT LOCATION: START ***************

  const options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    const lat = crd.latitude;
    const lon = crd.longitude;
    const API_KEY = "pk.eyJ1IjoiYmFhbTI1IiwiYSI6ImNsOG4wNzViMzAwcjAzd2xhMm52ajJoY2MifQ.kxO2vxRxoGGrvJjxnQhl5g";
    const API_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?limit=1&types=place%2Ccountry&access_token=${API_KEY}`;
    if (lat && lon) {
      axios
        .get(API_URL)
        .then((data) => {
          const address = data?.data?.features[0]?.place_name;
          handleSetState({
            location: { trait_type: "location", value: address },
          });
        })
        .catch((err) => console.log(err));
    }
  }

  const error = (err) => {
    dispatch(setNotification({ message: "couldn't get location", type: "error" }));
  };
  const getLocation = () => navigator.geolocation.getCurrentPosition(success, error, options);
  const details = navigator?.userAgent;

  const regexp = /android|iphone|kindle|ipad/i;

  const isMobileDevice = regexp.test(details);

  const accessDenied = () => {
    if (!isMobileDevice && !showLocation) {
      dispatch(
        setNotification({
          message: " Mobile browser location not support yet",
          type: "warning",
        })
      );
    }
  };

  const enableAccess = () => {
    if (!navigator.geolocation) {
      dispatch(
        setNotification({
          message: "Geolocation not supported",
          type: "error",
        })
      );
      return;
    }
    if (location !== "") return;
    getLocation();
  };

  // *************** GET CURRENT LOCATION: END ***************

  return (
    <div className={classes.container}>
      <Popup handleSetState={handleSetState} popupProps={popupProps} />
      {preview ? (
        <CollectionPreview
          previewSelectMode={previewSelectMode}
          file={file}
          metadata={metadata}
          handleMintSetState={handleSetState}
          collectionProfile={collectionProfile}
          handleSetFileState={handleSetFileState}
          zip={zip}
        />
      ) : (
        <>
          <BackButton />
          <div className={classes.wrapper}>
            <div className={classes.header}>
              <div className={classes.headerTitle}>Create Your NFT</div>
              {file?.length > 1 ? (
                <div className={classes.headerDescription}>
                  Upload a{" "}
                  <span>
                    collection
                    <BorderIcon />
                  </span>{" "}
                  to create NFTs on any of our <br />
                  supported blockchains super fast!
                </div>
              ) : (
                <div className={classes.headerDescription}>Upload an image to create NFT</div>
              )}
            </div>
            <div className={classes.grid}>
              {/* <Category handleSetState={handleSetState} category={category} file={file} params={params} /> */}
              <div className={classes.mintSection}>
                <section className={classes.assetContainer}>
                  {tweet ? (
                    <div ref={tweetRef}>
                      <Tweeter tweet={tweet} />
                    </div>
                  ) : ipfsLink ? (
                    <div className={classes.ipfs}>
                      <IpfsImage ipfsLink={ipfsLink} type={ipfsType} />
                    </div>
                  ) : (
                    <div className={`${classes.imageContainers} ${file?.length === 1 && classes.single}`}>
                      {mintId === "ai" ? (
                        <img src={aiData.imageUrl} alt="" className={classes.singleImage} />
                      ) : (
                        file &&
                        (file?.length > 1 ? (
                          file
                            .filter((_, idx) => idx < 12)
                            .map((f, idx) => (
                              <img src={URL.createObjectURL(f)} key={idx} className={classes.imageWrapper} />
                            ))
                        ) : videoExtensions.includes(fileExtension) ? (
                          <video src={URL.createObjectURL(file[0])} alt="" className={classes.singleImage} controls />
                        ) : audioExtensions.includes(fileExtension) ? (
                          <audio src={URL.createObjectURL(file[0])} className={classes.singleImage} controls muted />
                        ) : (
                          <img
                            src={mintId !== "ai" ? URL.createObjectURL(file[0]) : aiData.imageUrl}
                            alt=""
                            className={classes.singleImage}
                          />
                        ))
                      )}
                      {category === "Vibe" && <VibesLogo className={classes.overlayImage} />}
                    </div>
                  )}

                  <div className={classes.assetInfo}>
                    <div className={classes.innerAssetInfo}>
                      <div className={classes.assetInfoTitle}>
                        <span>
                          {tweet
                            ? `${tweet.author_id.username + moment(tweet.created_at).format(" hh:mm a · MM Do, YYYY")}`
                            : mintId === "ai"
                            ? fileName
                            : fName}
                        </span>
                      </div>
                      <div>
                        <span>
                          {"Number of assets: "}
                          {file?.length ? file.length : 1}
                        </span>
                      </div>
                      {file?.length > 1 ? (
                        <div onClick={() => handleSetState({ preview: true })} className={classes.showPreview}>
                          <span>view all assets</span>
                          <img src={rightArrow} alt="" />
                        </div>
                      ) : null}
                    </div>
                    <SecondaryButton
                      text="Change Asset"
                      width="150px"
                      onClick={() => {
                        tweet ? history.push("/mint/tweet") : changeFile();
                      }}
                    />
                  </div>
                </section>
                <div className={classes.mintForm}>
                  <div className={classes.heading}> {getActivetitle()}</div>

                  <section className={classes.details}>
                    {/* <div className={classes.category}>Asset Details</div> */}
                    <div className={classes.inputWrapper}>
                      <label>
                        {"Add NFT Name "}
                        <span className={classes.required}>*</span>
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(event) => {
                          handleSetState({ fileName: event.target.value });
                        }}
                      />
                    </div>

                    {category === "Vibe" && (
                      <div className={classes.inputWrapper}>
                        <label>Friendliness</label>
                        <SliderInput
                          MAX={10}
                          value={vibeProps.friendliness}
                          handleChange={(e) => {
                            const friendliness = e.target.value;
                            const newProps = vibeProps;
                            newProps.friendliness = friendliness;
                            handleSetState({
                              vibeProps: newProps,
                            });
                          }}
                        />
                        <label>Energy</label>
                        <SliderInput
                          MAX={10}
                          value={vibeProps.energy}
                          handleChange={(e) => {
                            const energy = e.target.value;
                            const newProps = vibeProps;
                            newProps.energy = energy;
                            handleSetState({
                              vibeProps: newProps,
                            });
                          }}
                        />
                        <label>Density</label>
                        <SliderInput
                          MAX={10}
                          value={vibeProps.density}
                          handleChange={(e) => {
                            const density = e.target.value;
                            const newProps = vibeProps;
                            newProps.density = density;
                            handleSetState({
                              vibeProps: newProps,
                            });
                          }}
                        />
                        <label>Diversity</label>
                        <SliderInput
                          MAX={10}
                          value={vibeProps.diversity}
                          handleChange={(e) => {
                            const diversity = e.target.value;
                            const newProps = vibeProps;
                            newProps.diversity = diversity;
                            handleSetState({
                              vibeProps: newProps,
                            });
                          }}
                        />
                      </div>
                    )}

                    <div className={classes.inputWrapper}>
                      <label>
                        Description <span className={classes.required}>{" *"}</span>{" "}
                        {/* <GenadropToolTip
                        content="This description will be visible on your collection page"
                        fill="#0d99ff"
                      /> */}
                      </label>
                      <textarea
                        style={metadata?.length === 1 ? { pointerEvents: "none" } : {}}
                        rows="5"
                        value={description}
                        onChange={(event) => handleSetState({ description: event.target.value })}
                      />
                    </div>

                    {(file?.length === 1 || ipfsLink) && (
                      <div className={`${classes.inputWrapper} ${classes.categoryWrapper}`}>
                        <label>
                          Category<span className={classes.required}>{" *"}</span>{" "}
                        </label>
                        <div
                          onClick={() => {
                            if (!metadata?.category) {
                              handleSetState({
                                toggleCategory: !toggleCategory,
                              });
                            }
                          }}
                          className={`${classes.chain} ${classes.active}`}
                        >
                          {category ? (
                            <div className={classes.chainLabel}>{category}</div>
                          ) : mintId === "Audio File" || ipfsType === "Audio" ? (
                            <div className={classes.chainLabel}>Audio</div>
                          ) : mintId === "Video File" || ipfsType === "Video" ? (
                            <div className={classes.chainLabel}>Video</div>
                          ) : mintId === "ai" ? (
                            <div className={classes.chainLabel}>Mint Art</div>
                          ) : (
                            <span>Select Category</span>
                          )}
                          {!metadata?.category && mintId !== "Audio File" && mintId !== "Video File" && (
                            <DropdownIcon className={classes.dropdownIcon} />
                          )}
                        </div>
                        <div className={`${classes.chainDropdown} ${toggleCategory && classes.active}`}>
                          {categories.map((nftCategory) => (
                            <div
                              className={`${classes.chain} `}
                              key={nftCategory}
                              onClick={() => handleSetState({ category: nftCategory, toggleCategory: false })}
                            >
                              {nftCategory}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {category === "Sesh" && (
                      <div className={classes.inputWrapper}>
                        <label>Stick Type</label>
                        <div
                          onClick={() => {
                            handleSetState({
                              toggleType: !toggleType,
                            });
                          }}
                          className={`${classes.chain} ${classes.active}`}
                        >
                          {stick_type ? <div className={classes.chainLabel}>{stick_type}</div> : <span>Select</span>}
                          <DropdownIcon className={classes.dropdownIcon} />
                        </div>
                        <div className={`${classes.chainDropdown} ${toggleType && classes.active}`}>
                          {stick_types.map((type) => (
                            <div
                              className={`${classes.chain} `}
                              key={type}
                              onClick={() => handleSetState({ stick_type: type, toggleType: false })}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {file?.length > 1 && (
                      <>
                        <div className={`${classes.inputWrapper} ${classes.dropInputWrapper}`}>
                          <label>
                            Collection photo
                            <GenadropToolTip content="This image will be used as collection logo" fill="#0d99ff" />
                          </label>
                        </div>
                        <div className={`${classes.dropWrapper} ${collectionProfile && classes.dropWrapperSeleted}`}>
                          <div onClick={() => handleSetState({ toggleGuide: true })}>
                            {profileSelected ? (
                              <img src={URL.createObjectURL(file[0])} alt="" />
                            ) : (
                              <div className={classes.selectImg}>
                                <Art />
                                <p>Add photo</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* *************** TOGGLE LOCATION: START *************** */}

                    {(category === "Vibe" || category === "Sesh") && file?.length === 1 && (
                      <div className={classes.inputWrapper}>
                        <div className={classes.toggleTitle}>
                          <div className={classes.receiverAddress}>
                            <div className={classes.toggleTitle}>
                              <label>Location</label>
                              <div className={classes.toggler}>
                                <label
                                  className={`${classes.switch} ${isMobileDevice && classes.noClick}`}
                                  onClick={() => (isMobileDevice ? accessDenied() : "")}
                                >
                                  <input
                                    id="location"
                                    type="checkbox"
                                    onClick={() => {
                                      enableAccess();
                                      handleSetState({ showLocation: !showLocation });
                                    }}
                                    defaultChecked={location !== ""}
                                  />
                                  <span className={classes.slider} />
                                </label>
                              </div>
                            </div>

                            {showLocation ? (
                              <div className={classes.inputContainer}>
                                <input
                                  type="text"
                                  value={location?.value ? location.value : "Getting location ..."}
                                  disabled
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* *************** TOGGLE LOCATION: END *************** */}

                    {/*  *************** TOGGLE TWEET: START ***************   */}
                    {tweet ? (
                      <>
                        <div className={classes.inputWrapper}>
                          <div className={classes.toggleTitle}>
                            <div className={classes.receiverAddress}>
                              <div className={classes.toggleTitle}>
                                <label>Hashtags</label>
                                <div className={classes.toggler}>
                                  <label className={`${classes.switch}`}>
                                    <input
                                      id="location"
                                      type="checkbox"
                                      defaultChecked={hashtags}
                                      onClick={() => (hashtags ? removeHashtag() : addHashtag())}
                                    />
                                    <span className={classes.slider} />
                                  </label>
                                </div>
                              </div>

                              <div className={classes.hashtags}>
                                {tweet?.hashtags[0]?.map((e) => {
                                  if (e !== null) {
                                    return (
                                      <div
                                        className={`${classes.hashtag}  ${!hashtags && classes.noTag}`}
                                      >{`#${e}`}</div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={classes.inputWrapper}>
                          <div className={classes.toggleTitle}>
                            <div className={classes.receiverAddress}>
                              <div className={classes.toggleTitle}>
                                <label>Mentions</label>
                                <div className={classes.toggler}>
                                  <label className={`${classes.switch}`}>
                                    <input
                                      id="location"
                                      type="checkbox"
                                      defaultChecked={mentions}
                                      onClick={() => (mentions ? removeMentions() : addMentions())}
                                    />
                                    <span className={classes.slider} />
                                  </label>
                                </div>
                              </div>

                              <div className={classes.hashtags}>
                                {tweet?.mentions[0]?.map((e) => {
                                  if (e !== null) {
                                    return (
                                      <div
                                        className={`${classes.hashtag}  ${!mentions && classes.noTag}`}
                                      >{`@${e}`}</div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/*  *************** TOGGLE TWEET: END ***************   */}

                    <div className={`${classes.inputWrapper} `}>
                      <div className={`${classes.toggleTitle}`}>
                        <div className={classes.category}>
                          Mint to {mintToMyAddress && category !== "Sesh" ? "my" : "Another"} Address{" "}
                          <div className={classes.toggler}>
                            <label className={classes.switch}>
                              <input
                                type="checkbox"
                                onClick={() => handleCheck()}
                                defaultChecked={account !== ""}
                                disabled={category === "Sesh"}
                              />
                              <span className={classes.slider} />
                            </label>
                          </div>
                          {/* <GenadropToolTip
                          content={`${
                            category === "Sesh"
                              ? "Input the Reciever address to mint"
                              : "Click toggle button to mint to another address. This can't be reversed."
                          }`}
                          fill="#0d99ff"
                        /> */}
                        </div>
                      </div>
                      <div className={classes.otherAddress}>
                        <div className={classes.receiverAddress}>
                          <label>Receiver Address</label>

                          <div className={classes.inputContainer}>
                            <input
                              style={zip ? { pointerEvents: "none" } : {}}
                              type="text"
                              value={mintToMyAddress && category !== "Sesh" ? account : receiverAddress}
                              placeholder={
                                account === "" ? "Please connect your wallet" : `Input a valid Receiver Address`
                              }
                              onChange={(event) => handleReceiverAddress(event)}
                              disabled={!!mintToMyAddress && category !== "Sesh"}
                            />
                            {goodReceiverAddress && account !== "" ? (
                              <GreenTickIcon />
                            ) : (
                              <GreenTickIcon className={classes.tick} />
                            )}
                          </div>
                        </div>
                        <button
                          disabled={!!mintToMyAddress && category !== "Sesh"}
                          type="button"
                          onClick={() => handleSetState({ openQrModal: true })}
                          className={classes.qrScanner}
                        >
                          {/* <QrCodeIcon /> */}
                        </button>
                      </div>
                    </div>

                    <div className={classes.inputWrapper}>
                      <div className={classes.confirm}>
                        <input className={classes.confirmCheckbox} type="checkbox" />
                        Please confirm you own the rights to use this image commercially.
                        <span className={classes.required}>*</span>
                      </div>
                    </div>
                  </section>
                </div>
                <section className={classes.mintButtonWrapper}>
                  <PrimaryButton text="Mint" onClick={onMint} />
                  <SecondaryButton text="Cancel" onClick={handleCancel} />
                </section>
              </div>
            </div>
            {openQrModal && (
              <QrReaderContainer
                dispatch={dispatch}
                handleCloseModal={handleCloseQrModal}
                handleAddress={handleSetState}
                mainnet={mainnet}
              />
            )}
          </div>
        </>
      )}
      <ProfileImgOverlay
        metadata={metadata}
        zip={zip}
        handleSetState={handleSetState}
        handleSetFileState={handleSetFileState}
        file={file}
        toggleGuide={toggleGuide}
        collectionProfile={collectionProfile}
      />
    </div>
  );
};

export default Minter;
