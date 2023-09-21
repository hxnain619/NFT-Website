/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-shadow */

import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as DropdownIcon } from "../../assets/icon-chevron-down.svg";
import { ReactComponent as Diskicon } from "../../assets/icon-disk.svg";
import { ReactComponent as LoadingIcon } from "../../assets/icon-loading.svg";
import CollectionDescription from "../../components/description/collection-description";
import GoogleAuth from "../../components/google-auth/googleAuth";
import LayerOrders from "../../components/layerorders/layerorders";
import { handleSampleLayers } from "../../components/menu/collection-menu-script";
import CollectionNameModal from "../../components/Modals/Collection-Name-Modal/CollectionNameModal";
import CollectionOverview from "../../components/overview/collection-overview";
import ProfileDropdown from "../../components/profile-dropdown/profileDropdown";
import SubscriptionNotification from "../../components/Subscription-Notification/SubscriptionNotification";
import {
  setOverlay,
  setSession,
  setToggleCollectionNameModal,
  setToggleSessionModal,
  setUpgradePlan,
} from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { fetchSession } from "../../renderless/store-data/StoreData.script";
import classes from "./create.module.css";
import ProgressBar from "./Progress-Bar/ProgressBar";
// import LoginModal from "../../components/Modals/Login-Modal/LoginModal";
import { signInWithGoogle } from "../../components/google-auth/googleAuth.script";

const CreateCollection = () => {
  const collectionNameRef = useRef();
  const history = useHistory();

  const [state, setState] = useState({
    isSignIn: false,
    toggleDropdown: false,
    toggleGuide: false,
    nameWidth: 0,
  });

  const { isSignIn, toggleDropdown, toggleGuide, nameWidth } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const { dispatch, isUser, currentUser, currentPlan, collectionName } = useContext(GenContext);

  const handleSample = () => {
    handleSampleLayers({ dispatch });
  };

  const handleTutorial = () => {
    handleSetState({ toggleGuide: true });
  };

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/session/pricing");
  };

  const handleSignIn = () => {
    handleSetState({ isSignIn: true });
    signInWithGoogle({ dispatch, handleSetState });
  };

  useEffect(() => {
    if (!currentUser || isUser === "true") return;
    const fetch = async () => {
      try {
        dispatch(setOverlay(true));
        const sessions = await fetchSession({ currentUser });
        dispatch(setOverlay(false));
        if (sessions.length) {
          dispatch(setSession(sessions));
          dispatch(setToggleSessionModal(true));
        } else if (!collectionName) {
          dispatch(setToggleCollectionNameModal(true));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [currentUser]);

  useEffect(() => {
    const width = collectionNameRef.current.offsetWidth;
    handleSetState({ nameWidth: width / 16 });
  }, [collectionName, currentUser]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <SubscriptionNotification />
      <CollectionNameModal />
      <div className={classes.details}>
        <div
          onClick={!isSignIn ? handleSignIn : () => {}}
          className={`${classes.signIn} ${!currentUser && classes.active}`}
        >
          <div className={`${classes.overlayer} ${isSignIn && classes.active}`}>
            <LoadingIcon className={classes.loadingIcon} />
          </div>
          Sign in to auto-save
        </div>
        <div className={`${classes.profileContainer} ${currentUser && classes.active}`}>
          <div
            onMouseOver={() => handleSetState({ toggleDropdown: true })}
            onMouseOut={() => handleSetState({ toggleDropdown: false })}
            className={`${classes.profile} ${currentUser && classes.active}`}
          >
            <GoogleAuth />
            <div className={classes.collectionNameContainer}>
              <div
                ref={collectionNameRef}
                className={`${classes.collectionName} ${currentUser && classes.active} ${
                  nameWidth > 6 && classes.move
                }`}
              >
                {collectionName}
              </div>
            </div>
            <ProfileDropdown
              dropdown={toggleDropdown}
              setDropdown={(e) => handleSetState({ toggleDropdown: e })}
              userName={currentUser?.displayName}
            />
            <div className={classes.dropdownIconContainer}>
              <DropdownIcon className={classes.dropdownIcon} />
            </div>
          </div>
          {currentPlan === "free" ? (
            <div onClick={handleUpgrade} className={classes.autoSave}>
              <Diskicon className={classes.diskIcon} />
              <div>Auto-save</div>
            </div>
          ) : (
            <ProgressBar />
          )}
        </div>
        <div className={classes.guide}>
          <div className={classes.guideHelpText}>Need help?</div>
          {currentPlan === "free" ? (
            <div onClick={handleSample} className={classes.guideSampleButton}>
              Try our samples
            </div>
          ) : null}
        </div>
      </div>
      <div className={classes.wrapper}>
        <LayerOrders />
        <CollectionOverview />
        <CollectionDescription />
      </div>
    </div>
  );
};

export default CreateCollection;
