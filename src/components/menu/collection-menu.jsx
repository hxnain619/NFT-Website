/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import React, { useContext, useRef, useState } from "react";
import { ReactComponent as Art } from "../../assets/art-icon-full.svg";
import { ReactComponent as AddIcon } from "../../assets/icon-layer-add.svg";
import { ReactComponent as UploadIcon } from "../../assets/icon-layer-upload.svg";
import { addImage } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import ArtCard from "../art-card/art-card";
import { handleAddBlank, handleFileChange } from "./collection-menu-script";
import classes from "./collection-menu.module.css";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers, imageQuality } = useContext(GenContext);
  const fileRef = useRef(null);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    const canvas = document.createElement("canvas");
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0]?.image,
      imageQuality,
    });
    dispatch(addImage(res));
  };

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <div className={classes.heading}>
          <h3 className={classes.title}>{layerTitle}</h3>
          <div className={classes.btnContainer}>
            <button onClick={() => fileRef.current.click()} className={classes.upload}>
              <UploadIcon className={classes.uploadIcon} /> Upload file
            </button>
            <button type="button" onClick={handleBlank} className={classes.addBlank}>
              <AddIcon className={classes.addIcon} /> Add blank
            </button>
          </div>
        </div>
        {/* list of images */}
        <div className={classes.wrapper}>
          {traits.length ? (
            traits.map((trait, idx) => (
              <ArtCard
                key={idx}
                index={idx}
                layerTitle={layerTitle}
                trait={trait}
                layerId={id}
                setActiveCard={(activeArtCard) => handleSetState({ activeCard: activeArtCard })}
                activeCard={activeCard}
              />
            ))
          ) : (
            <div onClick={() => fileRef.current.click()} className={classes.uploadCard}>
              <div className={classes.uploadIconBig}>
                <Art />
              </div>
              <div className={classes.uploadTitle}>Upload images</div>
              <div className={classes.uploadText}>
                Drag & drop files here or{" "}
                <button type="button" onClick={() => fileRef.current.click()} className={classes.uploadBtn}>
                  Browse files
                </button>
                <br />
                (Image/png, max file size: 2MB per image)
              </div>
            </div>
          )}
        </div>
      </section>

      <input
        onChange={(event) => dispatch(addImage(handleFileChange({ layerId: id, event, traits, layerTitle, dispatch })))}
        ref={fileRef}
        style={{ display: "none" }}
        type="file"
        name="avatar"
        id="avatar"
        accept="image/png"
        multiple
      />
    </div>
  );
};

export default CollectionMenu;
