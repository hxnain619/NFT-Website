/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-alert */
/* eslint-disable no-await-in-loop */
// import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
// eslint-disable-next-line import/no-extraneous-dependencies
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { ethers } from "ethers";
import JSZip from "jszip";
import { async } from "regenerator-runtime";
import { getRandomFromMetadata } from ".";
import { mintAbi, mintCollectionAbi, mintSingleAbi, mintSoulAbi } from "../constant/abi";
import { EVM_CHAINS } from "../constant/chain";
import { setLoader, setNotification } from "../gen-state/gen.actions";
import { getMarketAddress, getMinterAddress, getSingleMinterAddress, getSoulBoundAddress } from "./address";
import { chainNameToParams, getChainExplorerLink } from "./chain";
import { convertIpfsCidV0ToByte32 } from "./string";

const axios = require("axios");
const FormData = require("form-data");
const algosdk = require("algosdk");
const pinataSDK = require("@pinata/sdk");

const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_SECRET_KEY;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const config = require("./arc_config");
const write = require("./firebase");
const marketAbi = require("./marketAbi.json");

const pinFileToIPFS = async (pinataApiIFPSKey, pinataSecretApiKey, file, metadata, option) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();
  data.append("file", file);

  data.append("pinataMetadata", metadata);
  data.append("pinataOptions", option);
  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", // this is needed to prevent axios from erroring out with large files
      headers: {
        pinata_api_key: pinataApiIFPSKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      // handle error here
    });
};

const uploadToIpfs = async (nftFile, nftFileName, asset, isIpfsLink, isAi) => {
  // return console.log("MMM", nftFile, nftFileName, asset, isIpfsLink, isAi);
  const fileCat = isIpfsLink || isAi ? "*" : nftFile.type.split("/")[0];
  const nftFileNameSplit = nftFileName?.split(".");
  const fileExt = nftFileName ? nftFileNameSplit[1] : "png";

  const kvProperties = {
    url: nftFileName ? nftFileNameSplit[0] : "tweet",
    mimetype: `${fileCat}/${fileExt}`,
  };
  const pinataMetadata = JSON.stringify({
    name: asset.name,
    keyvalues: kvProperties,
  });

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  let resultFile = {};
  if (isIpfsLink) {
    resultFile.IpfsHash = nftFile.split("//")[1];
  } else {
    resultFile = await pinFileToIPFS(pinataApiKey, pinataApiSecret, nftFile, pinataMetadata, pinataOptions);
  }
  const metadata = config.arc3MetadataJSON;
  const integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash);
  if (!Array.isArray(asset.attributes)) {
    asset.attributes = Array(asset.attributes);
  }
  metadata.properties = [...asset.attributes];
  metadata.name = asset.name;
  metadata.description = asset.description;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `${integrity.base64}`;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;

  const resultMeta = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: asset.name },
  });
  const jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash);
  return {
    name: asset.name,
    description: asset.description,
    url: `ipfs://${resultMeta.IpfsHash}`,
    metadata: jsonIntegrity.buffer,
    integrity: jsonIntegrity.base64,
    media: resultFile.IpfsHash,
  };
};

const uploadFileViaServer = async (singleMintProps, chain) => {
  const { file, metadata, isIpfsLink, isAi, fileName } = singleMintProps;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", isAi || isIpfsLink ? fileName : file.name);
  formData.append("asset", JSON.stringify(metadata));
  const response = await axios.post(process.env.REACT_APP_BACKEND, formData, {
    auth: {
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_PASSWORD,
    },
  });

  return response;
};

export const connectAndMint = async (file, metadata, imgName, retryTimes, isIpfsLink, isAi) => {
  try {
    await pinata.testAuthentication();
    return await uploadToIpfs(file, imgName, metadata, isIpfsLink, isAi);
  } catch (error) {
    console.error(error);
    if (retryTimes === 1) {
      alert("network error while uploading file");
      throw error;
    }
    return connectAndMint(file, metadata, imgName, retryTimes - 1, isIpfsLink, isAi);
  }
};

export async function mintSoulBound(mintprops, chain) {
  const {
    file,
    metadata,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
  } = mintprops;

  const soulBoundAddress = getSoulBoundAddress(chain, mainnet);

  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", isAi || isIpfsLink ? fileName : file.name);
    formData.append("asset", JSON.stringify(metadata));
    const rd = await axios.post(process.env.REACT_APP_BACKEND, formData, {
      auth: {
        username: process.env.REACT_APP_USERNAME,
        password: process.env.REACT_APP_PASSWORD,
      },
    });
    const asset = rd.data.content.upload;
    // const uintArray = asset.metadata.toLocaleString();
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(soulBoundAddress, mintSoulAbi, signer);
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: soulBoundAddress,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("safeMint", [receiverAddress, asset.url]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));

      const txUrl = `${getChainExplorerLink(chain, mainnet)}tx/${result.hash}`;
      return txUrl;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", isAi || isIpfsLink ? fileName : file.name);
  formData.append("asset", JSON.stringify(metadata));
  const rd = await axios.post(process.env.REACT_APP_BACKEND, formData, {
    auth: {
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_PASSWORD,
    },
  });
  const asset = rd.data.content.upload;
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(soulBoundAddress, mintSoulAbi, signer);
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.safeMint(receiverAddress, asset.url);
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));

    const txUrl = `${getChainExplorerLink(chain, mainnet)}tx/${txn.hash}`;
    return txUrl;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: error.message ? error.message : "something went wrong! check your connected network and try again.",
    };
  }
}

export async function mintSingleToChain(singleMintProps, chain) {
  const {
    file,
    metadata,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = singleMintProps;
  if (isSoulBound) {
    return mintSoulBound(singleMintProps, chain); // Assuming mintSoulBound accepts the same parameters
  }

  const singleMinterAddress = getSingleMinterAddress(chain, mainnet);

  try {
    dispatch(setLoader("uploading 1 of 1"));

    const response = await uploadFileViaServer(singleMintProps, chain);

    const asset = response.data.content.upload;
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));

    dispatch(setLoader("minting 1 of 1"));

    const signer = connector.isWalletConnect
      ? new ethers.providers.Web3Provider(connector).getSigner()
      : await connector.getSigner();

    const contract = new ethers.Contract(singleMinterAddress, mintSingleAbi, signer);
    const ethNonce = await signer.getTransactionCount();

    const tx = {
      from: account,
      to: singleMinterAddress,
      data: contract.interface.encodeFunctionData("mint", [receiverAddress, id, 1, asset.url, "0x"]),
      nonce: ethNonce,
    };

    const result = await signer.sendTransaction(tx);
    await result.wait();
    dispatch(setLoader(""));

    const txUrl = `${getChainExplorerLink(chain, mainnet)}tx/${result.hash}`;
    return txUrl;
  } catch (error) {
    dispatch(setLoader(""));
    console.error(error);
    return {
      error,
      message: error.message || "Something went wrong! Please check your connected network and try again.",
    };
  }
}

export async function createNFT(createProps, doAccountCheck) {
  const { file, dispatch, account, setNotification, setLoader } = createProps;
  const assets = [];
  const zip = new JSZip();
  const data = await zip.loadAsync(file);
  const files = data.files["metadata.json"];
  const metadataString = await files.async("string");
  const metadata = JSON.parse(metadataString);
  try {
    if (doAccountCheck) {
      // alert("doing checkings");
      try {
        const userInfo = await algodClient.accountInformation(account).exclude("all").do();
        const assetBalance = userInfo["total-assets-opted-in"];
        const userBalance = algosdk.microalgosToAlgos(userInfo.amount);
        // alert(userBalance);
        const estimateTxFee = 0.001 * metadata.length;
        // alert((assetBalance + metadata.length) * 0.1 + estimateTxFee > userBalance);
        if ((assetBalance + metadata.length) * 0.1 + estimateTxFee > userBalance) {
          // alert("returning false");
          return false;
        }
      } catch (error) {
        console.log("SUS", error);
      }
    }
  } catch (error) {
    console.log("this is the error", error);
    // alert(error);
  }
  dispatch(
    setNotification({
      message: "uploading assets, do not refresh your page.",
      type: "warning",
    })
  );
  for (let i = 0; i < metadata.length; i += 1) {
    dispatch(setLoader(`uploading ${i + 1} of ${metadata.length}`));
    const imgName = metadata[i].image;
    const imgFile = data.files[imgName];
    const uint8array = await imgFile.async("uint8array");
    const blob = new File([uint8array], imgName, { type: imgName.split(".")[1] });
    // const asset = await connectAndMint(blob, metadata[i], imgName, 4);
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("fileName", imgName);
    formData.append("asset", JSON.stringify(metadata[i]));
    const rd = await axios.post(process.env.REACT_APP_BACKEND, formData, {
      auth: {
        username: process.env.REACT_APP_USERNAME,
        password: process.env.REACT_APP_PASSWORD,
      },
    });
    const asset = rd.data.content.upload;
    assets.push(asset);
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "uploaded successfully",
      type: "success",
    })
  );
  return assets;
}

export async function listNetworkNft(nftProps, chainName) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;

  const marketAddress = getMarketAddress(chainName, mainnet);

  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(marketAddress, marketAbi, signer);
    const contract = new ethers.Contract(nftContract, mintSingleAbi, signer);
    // const contract = new ethers.Contract(
    //   mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    //   mintSingleAbi,
    //   signer
    // );
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);

    try {
      // only pop approval equest if unapproved
      if (!approvalCheck) {
        dispatch(setLoader("Approve marketplace to list nft"));
        const ethNonce = await signer.getTransactionCount();
        const approvalTx = {
          from: account,
          to: contract.address,
          // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
          // gasPrice: ethers.utils.parseUnits('5', "gwei"),
          data: contract.interface.encodeFunctionData("setApprovalForAll", [marketContract.address, true]),
          nonce: ethNonce,
        };
        const result = await signer.sendTransaction(approvalTx);
        await result.wait();
      }
      const ethNonce = await signer.getTransactionCount();
      const listingTx = {
        from: account,
        to: marketContract.address,
        // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
        // gasPrice: ethers.utils.parseUnits('5', "gwei"),
        data: marketContract.interface.encodeFunctionData("createMarketplaceItem", [
          nftContract,
          id,
          String(price * 10 ** 18),
          "General",
          account,
        ]),
        nonce: ethNonce,
      };
      const result = await signer.sendTransaction(listingTx);
      await result.wait();
      dispatch(setLoader(""));

      const txUrl = `${getChainExplorerLink(chainName, mainnet)}tx/${result.hash}`;
      return txUrl;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(marketAddress, marketAbi, signer);
  try {
    const contract = new ethers.Contract(nftContract, mintSingleAbi, signer);
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);
    if (!approvalCheck) {
      dispatch(setLoader("Approve marketplace to list nft"));
      const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
      await approvalTxn.wait();
    }
    dispatch(setLoader("Listing Nft to marketplace"));
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    const txUrl = `${getChainExplorerLink(chainName, mainnet)}tx/${txn.hash}`;
    return txUrl;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function initializeContract(contractProps) {
  const { minterAddress, fileName, connector, account, dispatch, setLoader, description } = contractProps;
  const name = fileName.split("-")[0];
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: minterAddress,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: collectionContract.interface.encodeFunctionData("createCollection", [
        name,
        name.substring(0, 3).toUpperCase(),
        description,
      ]),
      nonce: ethNonce,
    };
    const result = await signer.sendTransaction(tx);
    await result.wait();
    dispatch(setLoader("minting"));
    dispatch(setLoader(""));
    const getCollectionAddresses = await collectionContract.collectionsOf(account);
    const collectionAddresses = [...getCollectionAddresses];
    const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
    return contract;
  }
  const signer = await connector.getSigner();
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  const tx = await collectionContract.createCollection(name, name.substring(0, 3).toUpperCase(), description, {
    gasLimit: ethers.utils.parseUnits("0.000000000001", "ether"),
  });
  dispatch(setLoader("minting"));
  await tx.wait();
  dispatch(setLoader(""));
  const getCollectionAddresses = await collectionContract.collectionsOf(account);
  const collectionAddresses = [...getCollectionAddresses];
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  console.log("contract", contract);
  return contract;
}

export async function importToChain(chainProps, chainName) {
  const { collectionAddress, connector, account, mainnet, dispatch, setLoader } = chainProps;
  const name = "test_collection_name";
  const description = "test_collection_desc";
  const minterAddress = getSingleMinterAddress(chainName, mainnet);

  const signer = await connector.getSigner();
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  const tx = await collectionContract.importCollection(name, name.substring(0, 3).toUpperCase(), collectionAddress, {
    gasLimit: ethers.utils.parseUnits("0.000000000003", "ether"),
  });
  console.log(collectionContract, collectionAddress);
  dispatch(setLoader("importing"));
  await tx.wait();
  dispatch(setLoader(""));
  const getCollectionAddresses = await collectionContract.collectionsOf(account);
  const collectionAddresses = [...getCollectionAddresses];
  console.log(collectionAddresses.pop());
}

export async function mintToChain(chainProps, chainName) {
  const { account, connector, fileName, description, dispatch, setNotification, setLoader, mainnet, receiverAddress } =
    chainProps;
  const ipfsJsonData = await createNFT({ ...chainProps });
  dispatch(setLoader("preparing assets for minting"));

  const minterAddress = getMinterAddress(chainName, mainnet);
  const contract = await initializeContract({
    minterAddress,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  await connector.getSigner();
  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    return parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  });

  // const amounts = new Array(ids.length).fill(1);
  let tx;
  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [receiverAddress, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      const txUrl = `${getChainExplorerLink(chainName, mainnet)}tx/${result.hash}`;
      return txUrl;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  try {
    const newIds = ids.map(() => 0);
    console.log("ids, uris", newIds, uris);
    tx = await contract.mintBatch(receiverAddress, newIds, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    console.log(error);
    dispatch(setLoader(""));
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs minted successfully",
      type: "success",
    })
  );
  const txUrl = `${getChainExplorerLink(chainName, mainnet)}tx/${tx.hash}`;
  return txUrl;
}

export async function getAlgoData(mainnet, id) {
  initAlgoClients(mainnet);
  const data = await algodClient.getAssetByID(id).do();
  console.log("algoData", data);
  return data;
}

export async function PurchaseNft(buyProps) {
  const { dispatch, nftDetails, account, connector, mainnet } = buyProps;
  dispatch(setLoader("executing transaction..."));
  initAlgoClients(mainnet);
  const params = await algodTxnClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const note = enc.encode("Nft Purchase");
  const note2 = enc.encode("Platform fee");
  const userBalance = await algodClient.accountInformation(account).do();
  const txns = [];
  if (algosdk.microalgosToAlgos(userBalance.amount) <= nftDetails.price) {
    dispatch(
      setNotification({
        message: "insufficent fund to cover cost",
        type: "warning",
      })
    );
    return false;
  }
  const appId = mainnet ? 939259299 : 121305178;

  const optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: nftDetails.Id,
    suggestedParams: params,
  });

  const platformFee = (nftDetails.price * 10) / 100;
  const sellerFee = nftDetails.price - platformFee;

  const paySeller = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: nftDetails.owner,
    amount: sellerFee * 1000000,
    note,
    suggestedParams: params,
  });
  txns.push(paySeller);

  const payTax = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: "AUF2C2IRJQMBXEG6CMB4EOKXQPNDEMCLZT7UJ4KYZAMIAFBNFCCBHG6KNQ",
    amount: platformFee * 1000000,
    note: note2,
    suggestedParams: params,
  });
  txns.push(payTax);

  // const appOptinTx = algosdk.makeApplicationOptInTxn(account, params, appId);

  const app_args = [new Uint8Array(Buffer.from("buy")), new Uint8Array(Buffer.from(nftDetails.owner))];

  const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC);
  const buyTxn = algosdk.makeApplicationCallTxnFromObject({
    from: account,
    suggestedParams: params,
    appIndex: appId,
    appArgs: app_args,
    accounts: [nftDetails.manager, manager.addr],
    foreignAssets: [nftDetails.Id],
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  });
  const appCloseTxn = algosdk.makeApplicationCloseOutTxn(nftDetails.manager, params, appId);
  const refundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: nftDetails.manager,
    to: nftDetails.manager,
    amount: 0,
    note,
    suggestedParams: params,
    closeRemainderTo: nftDetails.owner,
  });

  console.log("txes", appCloseTxn, refundTxn, params);

  const txList = [payTax, paySeller, optTxn, buyTxn, appCloseTxn, refundTxn];
  // const groupedTx = algosdk.assignGroupID(txList);
  const txnsFromManager = [appCloseTxn, refundTxn];

  const txnsToSign = txList.map((txn) => {
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    if (txnsFromManager.includes(txn)) {
      return {
        txn: encodedTxn,
        message: "Nft Sale",
        // Note: if the transaction does not need to be signed (because it's part of an atomic group
        // that will be signed by another party), specify an empty singers array like so:
        signers: [],
      };
    }
    return {
      txn: encodedTxn,
      message: "Nft Sale",
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });

  let result;
  try {
    console.log("To Soung??", txnsToSign);
    const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
    dispatch(
      setNotification({
        message: "please check your wallet to confirm transaction",
        type: "warning",
      })
    );
    result = await connector.send(request);
  } catch (error) {
    dispatch(
      setNotification({
        message: error.message,
        type: "error",
      })
    );
    throw error;
  }

  console.log("rihanna go girl X Fenty", result, manager.addr);
  const appCloseTxnSigned = appCloseTxn.signTxn(manager.sk);
  const refundTxnSigned = refundTxn.signTxn(manager.sk);

  const decodedResult = result.map((element) => (element ? new Uint8Array(Buffer.from(element, "base64")) : null));
  console.log("dcoded", decodedResult);
  decodedResult[4] = appCloseTxnSigned;
  decodedResult[5] = refundTxnSigned;
  console.log("dcoded 2", decodedResult);
  const tx = await algodTxnClient.sendRawTransaction(decodedResult).do();

  console.log("final tx", tx.txId);

  dispatch(setLoader(""));
  await write.writeNftSale(nftDetails.Id, nftDetails.price, account, tx.txId, nftDetails.owner);
  return mainnet ? `https://algoexplorer.io/tx/${tx.txId}` : `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

export async function purchasePolygonNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  // if (connector.isWalletConnect) {
  //   const provider = new ethers.providers.Web3Provider(connector);
  //   wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider);
  //   ({ chainId } = provider._network);
  // } else {
  //   wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  //   ({ chainId } = connector._network);
  // }
  price = ethers.utils.parseEther(price.toString()).toString();
  // const signature = await wallet._signTypedData(
  //   // Domain
  //   {
  //     name: "GenaDrop",
  //     version: "1.0.0",
  //     chainId,
  //     verifyingContract: mainnet
  //       ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //       : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   },
  //   // Types
  //   {
  //     NFT: [
  //       { name: "tokenId", type: "uint256" },
  //       { name: "account", type: "address" },
  //       { name: "price", type: "uint256" },
  //       { name: "seller", type: "address" },
  //       { name: "nftContract", type: "address" },
  //     ],
  //   },
  //   // Value
  //   { tokenId, account, price, seller, nftContract }
  // );
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(getMarketAddress(EVM_CHAINS.Polygon, mainnet), marketAbi, signer);
    const ethNonce = await signer.getTransactionCount();
    const saleTx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("nftSale", [price, tokenId, seller, nftContract]),
      value: price,
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(saleTx);
      await result.wait();
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      console.log("erooric data", error, error.data);
      return dispatch(
        setNotification({
          message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
          type: "warning",
        })
      );
    }
  }

  const contract = new ethers.Contract(getMarketAddress(EVM_CHAINS.Polygon, mainnet), marketAbi, connector.getSigner());
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, { value: price });
    await tx.wait();
    return mainnet ? `https://polygonscan.com/tx/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseAvaxNfts(buyProps) {
  const { dispatch, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  price = ethers.utils.parseEther(price.toString()).toString();
  const contract = new ethers.Contract(
    getMarketAddress(EVM_CHAINS.Avalanche, mainnet),
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, {
      value: price,
      gasLimit: ethers.utils.parseUnits("0.0000000000003", "ether"),
    });
    await tx.wait();
    return mainnet ? `https://snowtrace.io/tx/${tx.hash}` : `https://testnet.snowtrace.io/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export { pinata, write };
