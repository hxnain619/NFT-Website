/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./importCollection.module.css";
import GenadropToolTip from "../../Genadrop-Tooltip/GenadropTooltip";

import { GenContext } from "../../../gen-state/gen.context";
import supportedChains from "../../../utils/supportedChains";
import { importToChain } from "../../../utils/arc_ipfs";
import { setLoader, setNotification } from "../../../gen-state/gen.actions";

const ImportCollection = () => {
  // const [imageDimension, setImageDimension] = useState(256);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startBlock, setStartBlock] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const { dispatch, connector, account, chainId, mainnet, minter: minterFile } = useContext(GenContext);

  const history = useHistory();

  const isValidContractAddress = (address) => {
    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
  };

  const addressChanged = (e) => {
    setAddress(e.target.value);
    setEnabled(isValidContractAddress(e.target.value));
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!isValidContractAddress(address) || !name || !description || !startBlock) {
      return dispatch(
        setNotification({
          message: "fill in the required fields",
          type: "warning",
        })
      );
    }
    importToChain(
      {
        collectionAddress: address,
        connector,
        account,
        dispatch,
        mainnet,
        setLoader,
      },
      supportedChains[chainId].chain
    );
  };

  return (
    <>
      <header className={classes.importPageHeader}>
        <h2>Import Collection</h2>
        <p>With this feature, you can easily import a collection from the exsiting contract.</p>
      </header>
      <main className={classes.importMain}>
        <section className={`${classes.wrapper} ${classes.aiLeft}`}>
          <form className={classes.promptForm} onSubmit={formSubmitHandler}>
            <div className={classes.inputWrapper}>
              <label>
                {" "}
                Contract address<span className={classes.required}>*</span>
              </label>
              <input
                name="address"
                id="address"
                type="text"
                className={`${classes.wrapper} ${classes.aiTextInput} ${classes.required}`}
                value={address}
                onChange={addressChanged}
                // onBlur={addressChanged}
                placeholder="0x0e0878fbC369eEDb938885428c52465366206676"
                autoFocus
              />
            </div>
            <div className={classes.inputWrapper}>
              <label>
                {" "}
                Title <span className={classes.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                placeholder="title"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div className={classes.inputWrapper}>
              <label>
                Description <span className={classes.required}>*</span>{" "}
                <GenadropToolTip content="This description will be visible on your collection page" fill="#0d99ff" />
              </label>
              <textarea
                rows="5"
                value={description}
                placeholder="description"
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className={classes.inputWrapper}>
              <label>
                StartBlock <span className={classes.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="startblock number"
                value={startBlock}
                onChange={(event) => {
                  setStartBlock(event.target.value);
                }}
              />
            </div>
            <div className={classes.createBtn}>
              <button
                type="submit"
                className={`${classes.wrapper} ${classes.createImageBtn} ${classes.topMintBtn} ${
                  enabled ? classes.createImageBtn_active : classes.createImageBtn_inactive
                }`}
              >
                Import
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default ImportCollection;
