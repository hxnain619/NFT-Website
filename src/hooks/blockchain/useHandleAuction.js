import useHandleContracts from "./useHandleContracts";
import { Context } from "../../store";
import { useContext } from "react";
import { hexToNumber, convertBigIntToNumber } from "../../utils/blockchain";
import NFKEY_ABI from "../../abi/NFKEY_ABI.json";
import AirdropApi from "../../api/AirdropApi";
import { ethers } from "ethers";
// import { parseEther } from "ethers/lib/utils";

export default function useHandleAuction() {
  const handleContracts = useHandleContracts();
  const [{ user }] = useContext(Context);

  const transfer = (address, tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractERC721WithSigner(contractAddress)
      .transferFrom(user?.wallet_id, address, tokenID)
      .then((tx) => tx.wait());
  };

  const approveAuction = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractERC721WithSigner(contractAddress)
      .approve(process.env.REACT_APP_MARKETPLACE_AUCTION_ADDRESS, tokenID)
      .then((tx) => tx.wait());
  };

  const createAuction = (nftAddress, tokenID, startPrice, bidStep, blockDeadline, isToken = false, tokenAddress) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .create(nftAddress, tokenID, startPrice, bidStep, blockDeadline, isToken, tokenAddress)
      .then((tx) => tx.wait());
  };

  const getBids = (nftAddress, tokenId) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .bids(nftAddress, tokenId)
      .then((tx) => tx);
  };

  const bid = (nftAddress, tokenID, value) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .bid(nftAddress, tokenID, { value: value })
      .then((tx) => tx.wait());
  };

  const bidToken = (nftAddress, tokenID, value) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .bidToken(nftAddress, tokenID, value)
      .then((tx) => tx.wait());
  };

  const cancelAuction = (nftAddress, tokenID) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .cancel(nftAddress, tokenID)
      .then((tx) => tx.wait());
  };

  const finalize = (nftAddress, tokenID) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .finalize(nftAddress, tokenID)
      .then((tx) => tx.wait());
  };

  const checkAuction = (contractAddress, tokenID) => {
    return handleContracts
      .contractMarketplaceAuctionWithSigner()
      .auctions(contractAddress, tokenID)
      .then((tx) => ({
        owner: tx?.owner,
        startPrice: convertBigIntToNumber(tx?.startPrice._hex),
        bidStep: convertBigIntToNumber(tx?.bidStep._hex),
        blockDeadline: hexToNumber(tx?.blockDeadline._hex),
        active: tx?.active,
        finalized: tx?.finalized,
        isToken: tx?.isToken,
        tokenAddress: tx?.tokenAddress,
      }));
  };

  const getAllAuctions = async () => {
    console.log(`[useHandleAuction.js::getAllAuctions]`);

    const MAX_ATTEMPTS = 1000;
    const tokens = [];
    const tokenList = [];
    for (let i = 0; i < 5; i++) {
      await handleContracts
        .contractMarketplaceAuctionWithSigner()
        .auctionsAll(i)
        .then(async (tx) => {
          await handleContracts
            .contractMarketplaceAuction()
            .auctions(tx.nftAddress, hexToNumber(tx.tokenID._hex))
            .then(async (transaction) => {
              if (transaction.active) {
                tokens.push({
                  tokenId: hexToNumber(tx.tokenID._hex),
                  nftAddress: tx.nftAddress,
                  owner: transaction.owner,
                });
              }
            });
        })
        .catch((err) => {
          i = MAX_ATTEMPTS;
        });
    }

    for (let j = 0; j < tokens.length; j++) {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const signer = provider.getSigner();
      const contractNFKey = new ethers.Contract(tokens[j].nftAddress, NFKEY_ABI, provider);
      const contractNFKeyWithSigner = contractNFKey.connect(signer);

      await contractNFKeyWithSigner.tokenURI(tokens[j].tokenId).then(async (uri) => {
        const ipfsHash = uri.split("/").pop();
        const ipfsData = await new AirdropApi().getIpfs(ipfsHash);
        const tokenData = {
          owner: tokens[j].owner,
          contractAddress: tokens[j].nftAddress,
          tokenId: tokens[j].tokenId,
          ...ipfsData,
        };

        tokenList.push(tokenData);
      });
    }

    return tokenList;
  };

  return {
    transfer,
    approveAuction,
    createAuction,
    cancelAuction,
    checkAuction,
    bid,
    bidToken,
    getAllAuctions,
    getBids,
    finalize,
  };
}
