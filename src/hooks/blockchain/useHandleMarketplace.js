import useHandleContracts from "./useHandleContracts";
import { Context } from "../../store";
import { useContext } from "react";
import { hexToNumber } from "../../utils/blockchain";
import { ethers } from "ethers";

export default function useHandleMarketplace() {
  const handleContracts = useHandleContracts();
  const [{ user }, ACTION] = useContext(Context);

  const getListingCommission = async () => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .commissionPer()
      .then((tx) => ACTION.SET_MARKETPLACE_LISTING_COMMISSION(hexToNumber(tx?._hex)));
  };

  const transfer = (address, tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractERC721WithSigner(contractAddress)
      .transferFrom(user?.wallet_id, address, tokenID)
      .then((tx) => tx.wait());
  };

  const approveListing = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractERC721WithSigner(contractAddress)
      .approve(process.env.REACT_APP_MARKETPLACE_LISTING_ADDRESS, tokenID)
      .then((tx) => tx.wait());
  };

  const createListing = (
    startDate,
    endDate,
    price,
    tokenID,
    isToken,
    tokenAddress,
    contractAddress = process.env.REACT_APP_NFKEY_ADDRESS
  ) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .addListing(price, tokenID, contractAddress, startDate, endDate, isToken, tokenAddress)
      .then((tx) => tx.wait());
  };

  const purchaseListing = (tokenID, price, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .purchase(contractAddress, tokenID, {
        value: (price * 10 ** 18).toString(),
      })
      .then((tx) => tx.wait());
  };

  const purchaseListingToken = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .purchaseToken(contractAddress, tokenID)
      .then((tx) => tx.wait());
  };

  const cancelListing = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .cancelListing(tokenID, contractAddress)
      .then((tx) => tx.wait());
  };

  const checkListing = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .listings(contractAddress, tokenID)
      .then((tx) => {
        return {
          owner: tx?.owner,
          price: hexToNumber(tx?.price?._hex) / 10 ** 18,
          startDate: hexToNumber(tx?.startDate?._hex),
          endDate: hexToNumber(tx?.endDate?._hex),
          isToken: tx?.isToken,
          tokenAddress: tx?.tokenAddress,
        };
      });
  };

  const changePrice = (price, tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .changeListingPrice(price, tokenID, contractAddress)
      .then((tx) => tx.wait());
  };

  const onMakeOffer = (
    price,
    owner,
    tokenID,
    startDate,
    endDate,
    contractAddress = process.env.REACT_APP_NFKEY_ADDRESS
  ) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .makeOffer(price, owner, contractAddress, tokenID, startDate, endDate, {
        value: price,
      })
      .then((tx) => tx.wait());
  };

  const onMakeOfferWithToken = (
    price,
    owner,
    tokenID,
    startDate,
    endDate,
    isToken,
    tokenAddress,
    contractAddress = process.env.REACT_APP_NFKEY_ADDRESS
  ) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .makeOfferToken(price, owner, contractAddress, tokenID, startDate, endDate, isToken, tokenAddress)
      .then((tx) => tx.wait());
  };

  const onCancelOffer = (tokenID, offerID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .cancelOffer(tokenID, contractAddress, offerID)
      .then((tx) => tx.wait());
  };

  const onAcceptOffer = (tokenID, offerID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .acceptOffer(contractAddress, tokenID, offerID)
      .then((tx) => tx.wait());
  };

  const checkOffer = (tokenID, offerID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .offers(contractAddress, tokenID, offerID)
      .then((tx) => {
        return {
          price: +ethers.utils.formatEther(hexToNumber(tx?.price?._hex)?.toString()),
          owner: tx?.owner,
          from: tx?.buyer,
          id: hexToNumber(tx?.id?._hex),
          startDate: hexToNumber(tx?.startDate?._hex),
          endDate: hexToNumber(tx?.endDate?._hex),
          isToken: tx?.isToken,
          tokenAddress: tx?.tokenAddress,
        };
      })
      .catch((err) => null);
  };

  const getOffersLength = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractMarketplaceListingWithSigner()
      .offersCount(tokenID, contractAddress)
      .then((tx) => {
        return hexToNumber(tx?._hex);
      });
  };

  const approveOffer = (tokenID, contractAddress = process.env.REACT_APP_NFKEY_ADDRESS) => {
    return handleContracts
      .contractERC721WithSigner(contractAddress)
      .approve(process.env.REACT_APP_MARKETPLACE_LISTING_ADDRESS, tokenID)
      .then((tx) => tx.wait());
  };

  const mint = (walletAddress, ipfsLink) => {
    return handleContracts
      .contractMarketplaceCommunityCollectionWithSigner()
      .mint(walletAddress, ipfsLink)
      .then((tx) => tx.wait());
  };

  return {
    transfer,
    approveListing,
    createListing,
    purchaseListing,
    cancelListing,
    checkListing,
    changePrice,
    onMakeOffer,
    onAcceptOffer,
    onCancelOffer,
    checkOffer,
    getOffersLength,
    approveOffer,
    purchaseListingToken,
    onMakeOfferWithToken,
    getListingCommission,
    mint,
  };
}
