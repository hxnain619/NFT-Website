/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { ReactComponent as Art } from "../../../assets/create/art-icon.svg";
import collectionIcon from "../../../assets/icon-collection-light.svg";
import { setMinter, setZip } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import BackButton from "../../back-button/BackButton";
import MintIpfs from "../mintIPFS/mintIPFS";
import MintTweet from "../mintTweet/mintTweet";
import { NearErrorPop, NearSuccessPopup } from "../popup/nearMintPopup";
import classes from "./collection-single.module.css";

import { handleZipFile } from "./collection-single-script";

const CollectionToSingleMinter = () => {
  const params = useParams();
  const history = useHistory();
  const { url } = useRouteMatch();
  const location = useLocation();
  const fileRef = useRef(null);
  const dragRef = useRef(null);
  const fileTypes = {
    collection: ".zip",
    "Video File": ".mp4, .m4v, .mov, .mkv, .avi, .webm, .flv",
    "Audio File": ".mp3, .aac, .wav",
    "1of1": ".jpg, .jpeg, .png, .webp, .gif",
  };
  const { zip: zipObg, dispatch } = useContext(GenContext);
  const [state, setState] = useState({
    mintType: "",
    cameraSwitch: false,
    loading1: false,
    loading2: false,
    acceptedFileType: fileTypes[params.mintId],
    file: null,
    fileName: "",
    metadata: null,
    zip: null,
    popupProps: {
      isError: false,
      Popup: false,
      url: "",
    },
  });

  const { mintType, loading1, loading2, acceptedFileType, file, fileName, metadata, zip, popupProps } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  // const handleCollectionClick = () => {
  //   history.push(url.replace("1of1", "collection"));
  // };

  // const handle1of1Click = () => {
  //   history.push(url.replace("collection", "1of1"));
  // };

  const handleImageLoading1 = () => {
    handleSetState({ loading1: true });
  };

  const handleImageLoading2 = () => {
    handleSetState({ loading2: true });
  };

  useEffect(() => {
    const search = new URL(document.location).searchParams;
    if (search.get("errorCode")) {
      handleSetState({
        popupProps: {
          isError: true,
          Popup: true,
        },
      });
    }
    if (search.get("transactionHashes")) {
      handleSetState({
        popupProps: {
          isError: false,
          Popup: true,
          url: search.get("transactionHashes"),
        },
      });
    }
  }, []);

  const handleFileChange = (event) => {
    handleSetState({ fileName: "", file: null, metadata: null, zip: null });
    const uploadedFile = event.target.files[0];
    if (uploadedFile === null) return;

    const name = uploadedFile.name.replace(/\.+\s*\./, ".").split(".");
    const uploadedFileName = name.slice(0, name.length - 1).join(".");
    const fileType = name.slice(name.length - 1).join();

    if (!acceptedFileType.includes(fileType.toLowerCase())) return;

    if (fileType === "zip") {
      handleSetState({ zip: uploadedFile, fileName: uploadedFileName });
      handleZipFile({ uploadedFile, handleSetState });
    } else if (params.mintId === "Video File") {
      handleSetState({
        file: [uploadedFile],
        fileName: uploadedFileName,
        metadata: {
          attributes: {
            0: { trait_type: "File Type", value: "Video" },
          },
        },
      });
    } else if (params.mintId === "Audio File") {
      handleSetState({
        file: [uploadedFile],
        fileName: uploadedFileName,
        metadata: {
          attributes: {
            0: { trait_type: "File Type", value: "Audio" },
          },
        },
      });
    } else {
      handleSetState({
        file: [uploadedFile],
        fileName: uploadedFileName,
        metadata: {
          attributes: {
            0: { trait_type: "File Type", value: uploadedFile.type },
          },
        },
      });
    }
  };

  // read zip or camera picture file
  const handleZipUpload = () => {
    if (location.pathname === "/mint/collection" && zipObg.file.type === "application/zip") {
      handleSetState({ fileName: zipObg.name, zip: zipObg.file, file: null, metadata: null });
      handleZipFile({ uploadedFile: zipObg.file, handleSetState });
    } else {
      handleSetState({
        fileName: zipObg.name,
        file: [zipObg.file],
        metadata: {
          attributes: {
            0: { trait_type: "File Type", value: zipObg.file.type },
            ...(zipObg.attributes?.location && { 2: zipObg.attributes?.location }),
          },
          category: zipObg.type,
          smoking_stick: zipObg.attributes?.smoking_stick,
          location: zipObg.attributes?.location,
        },
        zip: null,
      });
    }
    dispatch(setZip({}));
  };

  useEffect(() => {
    if (params.mintId !== "tweet" && params.mintId !== "ipfs") {
      dragRef.current.ondragover = (e) => {
        e.preventDefault();
        document.querySelector(".drop-area").style.border = "2px dashed green";
      };
      dragRef.current.ondragleave = (e) => {
        e.preventDefault();
        document.querySelector(".drop-area").style.border = "2px solid var(--outline)";
      };
      dragRef.current.ondrop = (e) => {
        e.preventDefault();
        document.querySelector(".drop-area").style.border = "2px solid green";
        handleFileChange({ target: e.dataTransfer });
      };
    }
  }, []);

  // useEffect(() => {
  //   if (params.mintId === "collection") {
  //     handleSetState({ acceptedFileType: ".zip" });
  //   } else if (params.mintId === "Video File") {
  //     handleSetState({ acceptedFileType: ".mp4, .m4v, .mov, .mkv, .avi, .webm, .flv" });
  //   } else if (params.mintId === "Audio File") {
  //     handleSetState({ acceptedFileType: ".mp3, .aac, .wav" });
  //   } else {
  //     handleSetState({ acceptedFileType: ".jpg, .jpeg, .png, .webp, .gif" });
  //   }
  //   handleSetState({ mintType: params.mintId });
  //   console.log("ACCC", acceptedFileType);
  // }, [params.mintId, acceptedFileType]);

  useEffect(() => {
    if (Object.keys(zipObg).length !== 0) {
      handleZipUpload();
    }
  }, [zipObg]);

  useEffect(() => {
    if (!file) return;
    dispatch(setMinter({ file, fileName, metadata, zip, mintType }));
    history.push(`${url}/minter/`);
  }, [file]);

  return (
    <>
      {params.mintId === "tweet" ? (
        <MintTweet />
      ) : params.mintId === "ipfs" ? (
        <>
          <MintIpfs />
        </>
      ) : (
        <div ref={dragRef} className={classes.container}>
          {/* <div ref={dropRef} style={{display: 'none'}} className="drop-area"><UploadOverlay /></div>  */}
          {popupProps.isError && <NearErrorPop handleSetState={handleSetState} popupProps={popupProps} />}
          {!popupProps.isError && popupProps.Popup && (
            <NearSuccessPopup handleSetState={handleSetState} popupProps={popupProps} />
          )}
          <>
            <BackButton />

            <header className={classes.headingWrapper}>
              <h1 className={classes.heading}>Create your NFT</h1>
              <p className={classes.description}>
                Upload {params.mintId === "Audio File" ? "n " : " "}
                {params.mintId === "1of1"
                  ? "an image "
                  : params.mintId === "collection"
                  ? "collection "
                  : params.mintId === "Video File"
                  ? "a video "
                  : "Audio"}
                {/* <img src={line} alt="" />  */}
                to create NFT
              </p>
            </header>

            {mintType === "collection" ? (
              <div className={`${classes.card} ${classes[params.mintId]} drop-area`}>
                {!loading1 ? <div className={classes.imagePlaceholder} /> : null}
                <img
                  style={!loading1 ? { display: "none" } : {}}
                  src={collectionIcon}
                  alt=""
                  onLoad={handleImageLoading1}
                />
                <h3 className={classes.title}> Mint a collection</h3>
                <p className={classes.action}>Drag and Drop your zip file created using Genadrop Create app</p>
                <p className={classes.supportedFiles}>
                  We only support .Zip files for collection mints and deploy to Celo, Algorand, Aurora, and Polygon{" "}
                </p>
                <div>or</div>
                <button type="button" onClick={() => fileRef.current.click()} className={classes.btn}>
                  Browse files
                </button>
              </div>
            ) : (
              <div className={`${classes.card} ${classes[`_${params.mintId}`]} drop-area`}>
                <div className={classes.icon}>
                  <Art />
                </div>
                <h3 className={classes.title}> Digital Art</h3>
                {/* <Link className={classes.takePic} to="/mint/camera">
              <div>
                <CameraIcon />
              </div>
              <p>Open Camera</p>
            </Link>
            <div className={classes.explanatoryText}>
              <div>Take photo / video & mint straight away</div>
              <p>Record video and turn it into a GIF</p>
            </div>
            <div>or</div> */}
                <div className={classes.explanatoryText}>
                  <div>
                    Drag & Drop files here or
                    <button type="button" onClick={() => fileRef.current.click()} className={classes.btn}>
                      browse
                    </button>
                  </div>

                  <div>Files supported: JPG, PNG, SVG, GIF</div>
                </div>
              </div>
            )}

            <input
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
              accept={acceptedFileType}
            />
          </>
        </div>
      )}
    </>
  );
};

export default CollectionToSingleMinter;
