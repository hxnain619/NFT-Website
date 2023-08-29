/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { gql } from "@apollo/client";
import { ethers } from "ethers";
import {
  GET_GRAPH_COLLECTIONS,
  GET_FEATURED_SINGLE_NFT,
  GET_GRAPH_NFT,
  GET_SINGLE_GRAPH_COLLECTION,
  GET_USER_COLLECTIONS,
  GET_USER_NFT,
  GET_SIGNLE_NFTS,
} from "../../graphql/querries/getCollections";
import {
  getGraphCollection,
  getGraphCollections,
  getGraphNft,
  getGraphTransactionHistory,
  getSingleGraphNfts,
  getTransactions,
  getUserGraphNft,
  getNftCollections,
  getSingleNfts,
  getGraphCollectionData,
  getFeaturedGraphNft,
} from "../../utils";
import { avalancheClient, polygonClient, nearClient } from "../../utils/graphqlClient";

const soulboundSingleFilterAddress = ethers.utils.hexlify(process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS);

const clientByChain = (chainName) => {
  return chainName === "Polygon" ? polygonClient : chainName === "Avalanche" ? avalancheClient : avalancheClient;
};

export const getNftById = async (id, chainName) => {
  const client = clientByChain(chainName);
  const { data: nftData, error: nftError } = await client.query(GET_GRAPH_NFT, { id: id }).toPromise();
  if (nftError) return;
  let trHistory;
  let nftResult = [];
  if (nftData?.nft !== null) {
    nftResult = await getGraphNft(nftData?.nft);
    trHistory = await getTransactions(nftData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = nftResult[0].price;
    });
  }
  return [nftResult[0], trHistory];
};

export const getFeaturedChainNft = async (address, chainName) => {
  const { data, error } = await clientByChain(chainName).query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (error) return [];
  const result = await getFeaturedGraphNft(data?.nft);
  return result;
};

export const getChainCollectedNFTs = async (address, chainName) => {
  const { data, error: polygonError } = await clientByChain(chainName).query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const polygonBoughtNft = response?.filter((NFTS) => NFTS.sold === true);
  return polygonBoughtNft;
};

export const getChainMintedNFTs = async (address, chainName) => {
  const singleMinterAddress =
    chainName.toLowerCase() === "polygon"
      ? process.env.REACT_APP_ENV_STAGING === "false"
        ? ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS)
        : ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : chainName.toLowerCase() === "avalanche"
      ? process.env.REACT_APP_ENV_STAGING === "false"
        ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS)
        : ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS);

  const { data, error: dataError } = await clientByChain(chainName).query(GET_USER_NFT, { id: address }).toPromise();
  if (dataError) return;

  const response = await getSingleGraphNfts(data?.user?.nfts, data?.user?.id);
  const mintedNfts = response?.filter(
    (NFTS) => !NFTS?.sold && NFTS?.collectionId === singleMinterAddress // soulbound address ignored
  );
  return mintedNfts;
};

export const getSingleCollection = async (address, chainName) => {
  const client =
    chainName === "Polygon" ? polygonClient : chainName === "Avalanche" ? avalancheClient : avalancheClient;
  const { data, error } = await client.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getChainUserCollections = async (account, chainName) => {
  const { data, error: avaxError } = await clientByChain(chainName)
    .query(GET_USER_COLLECTIONS, { id: account })
    .toPromise();
  if (avaxError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const getAllNftsbyChain = async (limit = 0, chainName) => {
  const client =
    chainName === "Polygon" ? polygonClient : chainName === "Avalanche" ? avalancheClient : avalancheClient;
  const { data: graphData, error } = await client.query(GET_SIGNLE_NFTS(chainName, limit, false)).toPromise();
  const { data: sbData, error: sbError } = await client.query(GET_SIGNLE_NFTS(chainName, limit, true)).toPromise();

  if (error || sbError) return [];
  const data = getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};

export const getAllChainCollections = async (chainName) => {
  const singleMinterAddress =
    chainName.toLowerCase() === "polygon"
      ? process.env.REACT_APP_ENV_STAGING === "false"
        ? ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS)
        : ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : chainName.toLowerCase() === "avalanche"
      ? process.env.REACT_APP_ENV_STAGING === "false"
        ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS)
        : ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS);
  const { data, error } = await clientByChain(chainName).query(GET_GRAPH_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  // const filterAddress =
  //   process.env.REACT_APP_ENV_STAGING === "true"
  //     ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
  //     : ethers.utils.hexlify(process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter(
    (aurora) => aurora?.Id !== singleMinterAddress && aurora?.Id !== soulboundSingleFilterAddress
  );
  return res;
};

export const getAllPolygonCollections = async () => {
  const { data, error } = await polygonClient.query(GET_GRAPH_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress && aurora?.Id !== soulboundSingleFilterAddress);
  return res;
};

export const chainCollectionTransactions = async (id, chainName) => {
  const { data: chainData, error: chainError } = await clientByChain(chainName)
    .query(
      gql`query MyQuery {
      transactions(
        where: {nft_contains: "${id}"}
        orderBy: txDate
      ) {
        id
        price
        txDate
        txId
        type
        to {
          id
        }
        from {
          id
        }
      }
    }`
    )
    .toPromise();
  if (chainError) return;
  const transaction = getGraphTransactionHistory(chainData?.transactions);
  if (transaction) return (await transaction).reverse();
};
