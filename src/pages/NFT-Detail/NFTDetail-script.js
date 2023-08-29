/* eslint-disable no-return-await */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { readNftTransaction, readUserProfile } from "../../utils/firebase";
import { getCeloGraphNft, getGraphCollection, getNearNftDetailTransaction, getTransactions } from "../../utils";
import { getNftById, getAllNftsbyChain, getSingleCollection } from "../../renderless/fetch-data/fetchUserGraphData";
import supportedChains from "../../utils/supportedChains";
import { getCollectionNft } from "../../renderless/fetch-data/fetchNearCollectionData";

export const getGraphData = async ({ graphProps }) => {
  const {
    params: { collectionName, nftId, chainId },
  } = graphProps;

  if (collectionName) {
    const graphCollections = [];
    if (nftId.includes("genadorp.testnet")) {
      const nearGraphNft = await getCollectionNft(nftId);
      if (nearGraphNft.length) {
        const nearCollectionNft = await getNearCollection(collectionName);
        const nearTransactionHistory = await getNearNftDetailTransaction(nearCollectionNft[0]?.transactions);
        return {
          nftDetails: nearGraphNft[0],
          collection: nearCollectionNft,
          _1of1: [],
          transactionHistory: nearTransactionHistory,
        };
      }
    }

    if (collectionName.split("~")[1]) {
      const collectionChain = collectionName.split("~")[0];
      const collectionId = collectionName.split("~")[1];
      let nft = {};
      let transactionHistory = [];
      let collection = [];

      const [nftsData, _] = await getSingleCollection(collectionId, supportedChains[collectionChain]?.chain);
      nft = nftsData.find((key) => key.Id === nftId);
      collection = nftsData;
      transactionHistory = await getTransactions(nft.transactions);

      return {
        nftDetails: nft,
        transactionHistory,
        _1of1: [],
        collection,
      };
    }

    // filtering to get the unqiue collection
    let collection = graphCollections.find((col) => col.Id === collectionName);
    if (collection) {
      // filtering to get the unique nft
      const nft = collection.nfts.find((col) => col.id === nftId);

      if (nft) {
        try {
          const nftDetails = await getCeloGraphNft(nft);
          const transactionHistory = await getTransactions(nft.transactions);
          collection = await getGraphCollection(collection.nfts, collection);
          return {
            nftDetails: nftDetails[0],
            collection,
            _1of1: [],
            transactionHistory,
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
  } else {
    try {
      // Fetching for nft by Id comparing it to the chain it belongs to before displaying the Id
      const [nftData, trHistory] = await getNftById(nftId, supportedChains[Number(chainId)]?.chain);
      const nfts = await getAllNftsbyChain(10, supportedChains[Number(chainId)]?.chain);
      return {
        nftDetails: nftData,
        collection: [],
        transactionHistory: trHistory,
        _1of1: nfts,
      };
    } catch (error) {
      console.log({ error });
    }
  }
};

export const getCreator = async (owner) => {
  if (owner) return await readUserProfile(owner);
  return {};
};

export const breakAddress = (address = "", width = 6) => {
  return address && `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const getFormatedTxDate = (txDate) => {
  let newDate = null;
  if (typeof txDate === "object") {
    newDate = txDate.seconds;
  } else {
    newDate = txDate;
  }
  const now = new Date();
  const date = new Date(newDate * 1000);
  const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (diff < 0.04) return `${parseInt(diff * 24 * 60)} mins ago`;
  if (diff < 1) return `${parseInt(diff * 24)} hours ago`;
  if (diff < 31) return `${parseInt(diff)} days ago`;
  if (diff < 356) return `${parseInt(diff / 30)} months ago`;
  return `${diff / 30 / 12} years ago`;
};
