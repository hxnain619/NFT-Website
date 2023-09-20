import React, { useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

// Components
import { setNotification } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { getNftById } from "../../renderless/fetch-data/fetchUserGraphData";
import { listNetworkNft } from "../../utils/arc_ipfs";
import { readUserProfile } from "../../utils/firebase";
import supportedChains from "../../utils/supportedChains";

// icons
import avatar from "../../assets/avatar.png";

// Styles
import BackButton from "../../components/back-button/BackButton";
import LoadingScreen from "../NFT-Detail/Loading-Screen/LoadingScreen";
import classes from "./list.module.css";

const List = () => {
  const { account, chainId, connector, dispatch, mainnet } = useContext(GenContext);
  const [isFixedBidSelected, setisFixedBidSelected] = useState(true);
  const [isHighestBidSelected, setIsHighestBidSelected] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [minimumBid, setMinimumBid] = useState("");
  const [priceStep, setPriceStep] = useState("");

  const {
    params: { nftId },
  } = useRouteMatch();
  const match = useRouteMatch();
  const history = useHistory();

  const [state, setState] = useState({
    nftDetails: null,
    isLoading: true,
    tpNearMarket: false,
    fafNearMarket: false,
    price: 0,
    activeTab: "sell",
    image_url: "",
    chain: "",
  });

  const { nftDetails, isLoading, price, activeTab } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handlePrice = (event) => {
    handleSetState({ price: event.target.value });
  };

  const handleSetPriceClick = () => {
    setisFixedBidSelected(true);
    setIsHighestBidSelected(false);
  };

  const handleHighestBidClick = () => {
    setisFixedBidSelected(false);
    setIsHighestBidSelected(true);
  };

  // Event handler to update the state when the user selects a new date
  const handleStartDateChange = (event) => {
    const newDate = event.target.value;
    setStartDate(newDate);
  };

  // Event handler to update the state when the user selects a new date
  const handleEndDateChange = (event) => {
    const newDate = event.target.value;
    setEndDate(newDate);
  };

  // Event handler to update the state when the user selects a new date
  const handleStartTimeChange = (event) => {
    const newTime = event.target.value;
    setStartTime(newTime);
  };

  // Event handler to update the state when the user selects a new date
  const handleEndTimeChange = (event) => {
    const newTime = event.target.value;
    setEndTime(newTime);
  };

  const handleMinimumBid = (event) => {
    setMinimumBid(event.target.value);
  };

  const handlePriceStep = (event) => {
    setPriceStep(event.target.value);
  };

  const listNFT = async () => {
    if (isFixedBidSelected) {
      if (!price)
        return dispatch(
          setNotification({
            type: "warning",
            message: "Price cannot be empty",
          })
        );

      const listProps = {
        dispatch,
        account,
        connector,
        mainnet,
        price,
        id: nftDetails.tokenID,
        nftContract: nftDetails.collection_contract,
      };
      let listedNFT;

      if (["Polygon", "Avalanche", "Ethereum"].includes(supportedChains[chainId].chain)) {
        listedNFT = await listNetworkNft(listProps, supportedChains[chainId].chain);
      } else {
        return history.push(`${match.url}/listed`);
      }

      if (listedNFT.error) {
        dispatch(
          setNotification({
            message: "Transaction failed",
            type: "warning",
          })
        );
      } else {
        return history.push(`${nftId}/listed`);
      }
      return listedNFT;
    }
    if (!minimumBid)
      return dispatch(
        setNotification({
          type: "warning",
          message: "Mininum bid cannot be empty",
        })
      );
    if (!priceStep)
      return dispatch(
        setNotification({
          type: "warning",
          message: "Price step cannot be empty",
        })
      );

    return dispatch(
      setNotification({
        type: "warning",
        message: "NFT Auction listings are currently not supported.",
      })
    );
  };

  useEffect(() => {
    (async function getUserCollection() {
      if (chainId > 0) {
        const [nft] = await getNftById(nftId, supportedChains[chainId]?.chain);
        if (nft === null || !nft) {
          return (
            dispatch(
              setNotification({
                message: "Trying to list in a different chain, Please make sure you're connected to the right chain",
                type: "warning",
              })
            ),
            history.goBack()
          );
        }
        handleSetState({
          nftDetails: nft,
          isLoading: false,
        });
        return nftDetails;
      }
      return [];
    })();
  }, [chainId]);

  // Get userName
  async function getUsername(walletAddress) {
    const data = await readUserProfile(walletAddress);
    const updateNftDetails = nftDetails;
    updateNftDetails.username = data.username;
    handleSetState({
      nftDetails: updateNftDetails,
    });
  }

  useEffect(() => {
    const creator = nftDetails?.creator;
    if (creator) {
      getUsername(creator);
    }
  }, [nftDetails?.creator]);

  const breakAddress = (address = "", width = 3) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.backButton}>
        <BackButton />
      </div>

      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <h1>List Item for Sale</h1>

          <div className={classes.nft}>
            <img className={classes.artwork} src={nftDetails?.image_url} alt="" />
            <div className={classes.header}>
              <div className={classes.title}>{nftDetails?.name}</div>
            </div>
          </div>
          <div className={classes.footer}>
            {nftDetails?.creator && (
              <div className={classes.account}>
                <p>Created By</p>
                <div>
                  <img src={avatar} alt="avatar" />{" "}
                  {nftDetails && nftDetails.username ? nftDetails.username : breakAddress(nftDetails.creator)}
                </div>
              </div>
            )}
            {nftDetails?.collection_name && (
              <div className={classes.account}>
                <p>Collection</p>
                <div>{nftDetails.collection_name}</div>
              </div>
            )}
          </div>
        </div>
        <div className={classes.v_subsection2}>
          <h1>List Item for Sale</h1>

          <div className={`${classes.information} ${activeTab !== "sell" ? classes.disabled : ""}`}>
            <div className={classes.collectionHeader}>
              <div className={classes.text}>Sell Method</div>
              <div className={classes.accent}>*</div>
            </div>

            <div className={classes.dropdownItems}>
              <button
                type="button"
                className={`${classes.buy} ${isFixedBidSelected ? classes.selected : ""}`}
                onClick={handleSetPriceClick}
              >
                SET PRICE
              </button>
              <button
                type="button"
                className={`${classes.bid} ${isHighestBidSelected ? classes.selected : ""}`}
                onClick={handleHighestBidClick}
              >
                HIGHEST BID
              </button>
            </div>
          </div>
          <>
            {isFixedBidSelected ? (
              <div className={`${classes.information}`}>
                <div className={classes.collectionHeader}>
                  <div className={classes.text}>Set Price</div>
                  <div className={classes.accent}>*</div>
                </div>
                <section className={`${classes.dropdownContent}`}>
                  <div className={classes.inputWrapper}>
                    <input value={price} onChange={handlePrice} placeholder="E.g. 10" type="number" min="1" step="1" />
                    {supportedChains[chainId].symbol}
                  </div>
                </section>
              </div>
            ) : (
              <div className={classes.informationList}>
                <div className={`${classes.information}`}>
                  <section className={`${classes.dropdownContent}`}>
                    <div className={`${classes.inputWrapper} ${classes.date}`}>
                      <input
                        value={startDate}
                        onChange={handleStartDateChange}
                        placeholder="Select Start Date"
                        type="date"
                      />
                    </div>

                    <div className={`${classes.inputWrapper} ${classes.time}`}>
                      <input
                        value={startTime}
                        onChange={handleStartTimeChange}
                        placeholder="Select Start Date"
                        type="time"
                      />
                    </div>
                  </section>
                </div>

                <div className={`${classes.information}`}>
                  <section className={`${classes.dropdownContent}`}>
                    <div className={`${classes.inputWrapper} ${classes.date}`}>
                      <input value={endDate} onChange={handleEndDateChange} placeholder="Select End Date" type="date" />
                    </div>

                    <div className={`${classes.inputWrapper} ${classes.time}`}>
                      <input
                        value={endTime}
                        onChange={handleEndTimeChange}
                        placeholder="Select Start Date"
                        type="time"
                      />
                    </div>
                  </section>
                </div>

                <div className={`${classes.information}`}>
                  <div className={classes.collectionHeader}>
                    <div className={classes.text}>Mininum Bid</div>
                    <div className={classes.accent}>*</div>
                  </div>
                  <section className={`${classes.dropdownContent}`}>
                    <div className={classes.inputWrapper}>
                      <input
                        value={minimumBid}
                        onChange={handleMinimumBid}
                        placeholder="E.g. 10"
                        type="number"
                        min="1"
                        step="1"
                      />
                      {supportedChains[chainId].symbol}
                    </div>
                  </section>
                </div>

                <div className={`${classes.information}`}>
                  <div className={classes.collectionHeader}>
                    <div className={classes.text}>Price Step</div>
                    <div className={classes.accent}>*</div>
                  </div>
                  <section className={`${classes.dropdownContent}`}>
                    <div className={classes.inputWrapper}>
                      <input
                        value={priceStep}
                        onChange={handlePriceStep}
                        placeholder="E.g. 10"
                        type="number"
                        min="1"
                        step="1"
                      />
                      {supportedChains[chainId].symbol}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </>
          <div className={classes.listButtonWrapper}>
            <button onClick={listNFT} type="button" className={`${classes.listButton}`}>
              Post your Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
