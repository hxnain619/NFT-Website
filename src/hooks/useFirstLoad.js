import { useContext, useEffect } from "react";
import { Context } from "../store";
import useHandleCustomer from "./customer/useHandleCustomer";
import useHandleAuth from "./auth/useHandleAuth";
import useWalletConnect from "./blockchain/useWalletConnect";
import useHandleLoader from "./loader/useHandleLoader";
import useHandleNFT from "./blockchain/useHandleNFT";
import useHandleContracts from "./blockchain/useHandleContracts";
import useHandleTheme from "./theme/useHandleTheme";
import useHandleLpStaking from "./blockchain/useHandleLpStaking";
import useHandleMarketplace from "./blockchain/useHandleMarketplace";
import useHandleSocket from "./socket/useHandleSocket";
import useHandleRewards from "./blockchain/useHandleRewards";

export default function useEffectFirstLoad() {
  const [{ user }] = useContext(Context);

  const handleAdmin = useHandleCustomer();
  const handleAuth = useHandleAuth();
  const walletConnect = useWalletConnect();
  const handleLoader = useHandleLoader();
  const handleNFT = useHandleNFT();
  const handleContracts = useHandleContracts();
  const handleTheme = useHandleTheme();
  const handleLpStaking = useHandleLpStaking();
  const handleMarketplace = useHandleMarketplace();
  const handleSocket = useHandleSocket();
  const handleRewards = useHandleRewards();

  useEffect(() => {
    handleTheme.setDefaultTheme();

    if (!user?._id) {
      handleLoader
        .loaderWrapper(handleAdmin.fetchInfo, 2)
        .then((res) => !res && handleAuth.logout());
      //handleAdmin.fetchInfo().then(res => !res && handleAuth.logout());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?._id) {
      handleLoader.loaderWrapper(
        () => walletConnect.connectWallet(user?.wallet_id),
        2
      );
      console.log(`useFirstLoad.js::useEffect_user`);
      console.log(user);
      walletConnect.connectWallet(user?.wallet_id);

      handleSocket.init();
      handleNFT.loadNFTBalance(user?.wallet_id);
      walletConnect.ethereumListener(handleAuth.logout);
      /**
       * TODO: remove update function in below hooks
       * make aggregate async hook that fetch balance info
       * make aggregate action that update all balance info
       * do this in other code
       */

      //   handleNFT.balanceOfSMRTR(user?.wallet_id);
      //   handleNFT.balanceOfTRESR(user?.wallet_id);
      //   handleNFT.getAVAXBalance(user?.wallet_id);

      //   handleLpStaking.balanceOfLp(user?.wallet_id);
      //   handleLpStaking.balanceOfStakedLp(user?.wallet_id);
      handleNFT.updateProfileBalance(user?.wallet_id);
      /**
       * TODO: this is not used anymore
       */
      //   handleNFT.getBurnedTresr();
      //   handleNFT.getBurnedSmarter();
      //   handleNFT.getBonusPoolAllocation();
      //   handleNFT.getPoolAllocation();

      /**
       * TODO: remove update function in below hooks
       * make aggregate async hook that fetch below four functions
       * make separate action that update 4 info
       * do this in other code
       */
      handleRewards.updateClaimableBonusRewardBalance();
      //   handleRewards.getVeTresrBonusReward();
      //   handleRewards.getJlpSmrtBonusReward();
      //   handleRewards.getJlpTresrBonusReward();
      //   handleRewards.getKeyLevelBonusReward();

      /**
       * TODO: Promise.all(above backend apis)
       * then update 4 actions
       */
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
}
