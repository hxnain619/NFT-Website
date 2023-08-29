import { useEffect, useMemo, useRef } from "react";
import { ethers } from "ethers";
import WHITELIST_ABI from "../../abi/WHITELIST_ABI.json";
import NFKEY_ABI from "../../abi/NFKEY_ABI.json";
import SMARTR_ABI from "../../abi/SMARTR_ABI.json";
import NFKEY_STAKING_ABI from "../../abi/NFKEY_STAKING_ABI.json";
import TRESR_ABI from "../../abi/TRESR_ABI.json";
import REWARD_ABI from "../../abi/REWARD_ABI.json";
import TRESR_STAKING_ABI from "../../abi/TRESR_STAKING_ABI.json";
import LP_SMRTRAVAX_STAKING_ABI from "../../abi/LP_SMRTRAVAX_STAKING_ABI.json";
import LP_TRESRAVAX_STAKING_ABI from "../../abi/LP_TRESRAVAX_STAKING_ABI.json";
import LP_SMRTRAVAX_TOKEN_ABI from "../../abi/LP_SMRTRAVAX_TOKEN_ABI.json";
import LP_TRESRAVAX_TOKEN_ABI from "../../abi/LP_TRESRAVAX_TOKEN_ABI.json";
import MARKETPLACE_LISTING_ABI from "../../abi/MARKETPLACE_LISTING_ABI.json";
import MARKETPLACE_AUCTION_ABI from "../../abi/MARKETPLACE_AUCTION_ABI.json";
import COMMUNITY_COLLECTION from "../../abi/COMMUNITY_COLLECTION_ABI.json";
import ERC20_ABI from "../../abi/ERC20_ABI.json";
import ERC721_ABI from "../../abi/ERC721_ABI.json";
import MASTER_CHEF_ABI from "../../abi/MASTER_CHEF_ABI.json";

import { useWeb3React } from "@web3-react/core";

export default function useHandleContracts() {
  const context = useWeb3React();
  const { library } = context;
  //   const provider = useRef(null);
  //   //   let provider = new ethers.providers.Web3Provider(window?.ethereum);

  //   useEffect(() => {
  //     provider.current = new ethers.providers.Web3Provider(window?.ethereum);
  //   });
  //   useEffect(() => {
  //     if (library) {
  //       provider.current = library.provider; // eslint-disable-line
  //     }
  //   }, [library]); // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => {
    const getSigner = () => {
      if (!library) {
        return new ethers.providers.Web3Provider(window.ethereum).getSigner();
      } else {
        return library.getSigner();
      }
    };
    const getProvider = () => {
      if (library) {
        return library.provider;
      }
      return new ethers.providers.Web3Provider(window?.ethereum);
    };
    const contractWhitelist = () =>
      new ethers.Contract(
        process.env.REACT_APP_WHITELIST_ADDRESS,
        WHITELIST_ABI,
        getProvider()
      );
    const contractWhitelistWithSigner = () =>
      contractWhitelist().connect(getSigner());

    const contractNFKey = () =>
      new ethers.Contract(
        process.env.REACT_APP_NFKEY_ADDRESS,
        NFKEY_ABI,
        getProvider()
      );
    const contractNFKeyWithSigner = () => {
      return contractNFKey().connect(getSigner());
    };

    const contractSmarterCoin = () =>
      new ethers.Contract(
        process.env.REACT_APP_SMARTR_ADDRESS,
        SMARTR_ABI,
        getProvider()
      );
    const contractSmarterCoinWithSigner = () =>
      contractSmarterCoin().connect(getSigner());

    const contractNFKeyStaking = () =>
      new ethers.Contract(
        process.env.REACT_APP_NFKEY_STAKING_ADDRESS,
        NFKEY_STAKING_ABI,
        getProvider()
      );
    const contractNFKeyStakingWithSigner = () => {
      // console.log("contractNFKeyStakingWithSigner");
      console.time("contractNFKeyStakingWithSigner");
      let contract = contractNFKeyStaking().connect(getSigner());
      console.timeEnd("contractNFKeyStakingWithSigner");

      return contract;
    };
    const contractTresrCoin = () =>
      new ethers.Contract(
        process.env.REACT_APP_TRESR_ADDRESS,
        TRESR_ABI,
        getProvider()
      );
    const contractTresrCoinWithSigner = () =>
      contractTresrCoin().connect(getSigner());

    const contractDailyBonusRewards = () =>
      new ethers.Contract(
        process.env.REACT_APP_REWARD_ADDRESS,
        REWARD_ABI,
        getProvider()
      );
    const contractDailyBonusRewardsWithSigner = () =>
      contractDailyBonusRewards().connect(getSigner());

    const contractTresrStakingCoin = () =>
      new ethers.Contract(
        process.env.REACT_APP_TRESR_STAKING_ADDRESS,
        TRESR_STAKING_ABI,
        getProvider()
      );
    const contractTresrStakingCoinWithSigner = () =>
      contractTresrStakingCoin().connect(getSigner());

    const contractLpStakingTRESRAVAX = () =>
      new ethers.Contract(
        process.env.REACT_APP_LP_TRESRAVAX_STAKING_ADDRESS,
        LP_TRESRAVAX_STAKING_ABI,
        getProvider()
      );
    const contractLpStakingTRESRAVAXWithSigner = () =>
      contractLpStakingTRESRAVAX().connect(getSigner());

    const contractLpStakingSMRTRAVAX = () =>
      new ethers.Contract(
        process.env.REACT_APP_LP_SMRTRAVAX_STAKING_ADDRESS,
        LP_SMRTRAVAX_STAKING_ABI,
        getProvider()
      );
    const contractLpStakingSMRTRAVAXWithSigner = () =>
      contractLpStakingSMRTRAVAX().connect(getSigner());

    const contractLpCoinTRESRAVAX = () =>
      new ethers.Contract(
        process.env.REACT_APP_LP_TRESRAVAX_TOKEN_ADDRESS,
        LP_TRESRAVAX_TOKEN_ABI,
        getProvider()
      );
    const contractLpCoinTRESRAVAXWithSigner = () =>
      contractLpCoinTRESRAVAX().connect(getSigner());

    const contractLpCoinSMRTRRAVAX = () =>
      new ethers.Contract(
        process.env.REACT_APP_LP_SMRTRAVAX_TOKEN_ADDRESS,
        LP_SMRTRAVAX_TOKEN_ABI,
        getProvider()
      );
    const contractLpCoinSMRTRAVAXWithSigner = () =>
      contractLpCoinSMRTRRAVAX().connect(getSigner());

    const contractMarketplaceListing = () =>
      new ethers.Contract(
        process.env.REACT_APP_MARKETPLACE_LISTING_ADDRESS,
        MARKETPLACE_LISTING_ABI,
        getProvider()
      );
    const contractMarketplaceListingWithSigner = () =>
      contractMarketplaceListing().connect(getSigner());

    const contractMarketplaceAuction = () =>
      new ethers.Contract(
        process.env.REACT_APP_MARKETPLACE_AUCTION_ADDRESS,
        MARKETPLACE_AUCTION_ABI,
        getProvider()
      );
    const contractMarketplaceAuctionWithSigner = () =>
      contractMarketplaceAuction().connect(getSigner());

    const contractMarketplaceCommunityCollection = () =>
      new ethers.Contract(
        process.env.REACT_APP_COMMUNITY_COLLECTION_ADDRESS,
        COMMUNITY_COLLECTION,
        getProvider()
      );
    const contractMarketplaceCommunityCollectionWithSigner = () =>
      contractMarketplaceCommunityCollection().connect(getSigner());

    const contractMasterChef = () =>
      new ethers.Contract(
        process.env.REACT_APP_MASTER_CHEF_ADDRESS,
        MASTER_CHEF_ABI,
        getProvider()
      );
    const contractMasterChefWithSigner = () =>
      contractMasterChef().connect(getSigner());

    const contractERC20WithSigner = (contractAddress) => {
      const contract = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        getProvider()
      );
      return contract.connect(getSigner());
    };

    const contractERC721WithSigner = (contractAddress) => {
      const contract = new ethers.Contract(
        contractAddress,
        ERC721_ABI,
        getProvider()
      );
      return contract.connect(getSigner());
    };

    return {
      getProvider,
      contractWhitelist,
      contractWhitelistWithSigner,
      contractNFKey,
      contractNFKeyWithSigner,
      contractSmarterCoin,
      contractSmarterCoinWithSigner,
      contractNFKeyStaking,
      contractNFKeyStakingWithSigner,
      contractTresrCoin,
      contractTresrCoinWithSigner,
      contractDailyBonusRewards,
      contractDailyBonusRewardsWithSigner,
      contractTresrStakingCoin,
      contractTresrStakingCoinWithSigner,
      contractLpStakingTRESRAVAX,
      contractLpStakingTRESRAVAXWithSigner,
      contractLpStakingSMRTRAVAX,
      contractLpStakingSMRTRAVAXWithSigner,
      contractLpCoinTRESRAVAX,
      contractLpCoinTRESRAVAXWithSigner,
      contractLpCoinSMRTRRAVAX,
      contractLpCoinSMRTRAVAXWithSigner,
      contractMarketplaceListing,
      contractMarketplaceListingWithSigner,
      contractMarketplaceAuction,
      contractMarketplaceAuctionWithSigner,
      contractMarketplaceCommunityCollection,
      contractMarketplaceCommunityCollectionWithSigner,
      contractMasterChef,
      contractMasterChefWithSigner,
      contractERC20WithSigner,
      contractERC721WithSigner,
      getSigner,
    };
  }, [window.ethereum]);
}
