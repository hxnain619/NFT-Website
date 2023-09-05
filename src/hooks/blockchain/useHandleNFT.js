import { useCallback, useContext, useMemo } from "react";
import { Context } from "../../store";
import { ethers } from "ethers";
import AirdropApi from "../../api/AirdropApi";
import useHandleToastAlert from "../alert/useHandleToastAlert";
import { hexToNumber } from "../../utils/blockchain";
import useHandleContracts from "./useHandleContracts";
import useHandleToken from "../token/useHandleToken";
import useHandleCollection from "./useHandleCollection";
import {
  ACTIVATE_KEY_ALERT,
  ALERT_STATUS_FAILURE,
  ALERT_STATUS_SUCCESS,
  DEACTIVATE_KEY_ALERT,
  UPGRADE_KEY_ALERT,
} from "../../constant/alert";
import useHandleCustomer from "hooks/customer/useHandleCustomer";

/* global BigInt */

export default function useHandleNFT() {
  const [{ user, token, balance }, ACTION] = useContext(Context);
  const handleToastAlert = useHandleToastAlert();
  const handleCollection = useHandleCollection();
  const handleCustomer = useHandleCustomer();
  const handleToken = useHandleToken();
  const handleContracts = useHandleContracts();

  const getNFkeyInfo = async (_token) => {
    const tokenIdList = token?.list?.map((item) => item.tokenId);
    console.log("[useHandleNFT::getNFkeyInfo]", _token);

    return Promise.all([
      handleContracts
        .contractNFKeyWithSigner()
        .getAmountUpgradeKey(_token.tier)
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18)
        .then((res) => Math.ceil(+res))
        .catch((err) => console.log(err)),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .calcUnlockCost(_token.tokenId)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .calcBaseProbToOpen(_token.tokenId)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex) / 10),
      handleContracts
        .contractNFKeyWithSigner()
        .getUpgradeDelay(_token.tokenId)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)),
      // handleContracts
      //   .contractNFKeyStakingWithSigner()
      //   .getTimeToTreasureUnlock(_token.tokenId)
      //   .then((tx) => hexToNumber(tx?._hex)),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .pendingAllBaseReward(tokenIdList)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .calcRewards(_token.tokenId)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .calcRewardsPerSecond(_token.tokenId)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18),
      handleContracts
        .contractNFKeyStakingWithSigner()
        .calcRewardsPerSecondByTokens(tokenIdList)
        .catch((err) => console.log(err))
        .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18),
    ]);
  };
  const updateProfileBalance = async (address, count = 3) => {
    console.log(`[useHandleNFT::updateProfileBalance]`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    Promise.all([
      handleContracts.contractSmarterCoinWithSigner().balanceOf(address),
      handleContracts.contractTresrCoinWithSigner().balanceOf(address),
      provider.getBalance(address),
      handleContracts.contractLpCoinTRESRAVAXWithSigner().balanceOf(address),
      handleContracts.contractLpStakingTRESRAVAXWithSigner().stakedBalanceOf(address),
    ]).then((res) => {
      ACTION.SET_BALANCE_SMRTR(hexToNumber(res[0]._hex) / Math.pow(10, 18));
      ACTION.SET_BALANCE_TRESR(hexToNumber(res[1]._hex) / Math.pow(10, 18));
      ACTION.SET_BALANCE_AVAX(+ethers.utils.formatEther(res[2]));
      ACTION.SET_BALANCE_LP_TRESRAVAX(hexToNumber(res[3]._hex) / Math.pow(10, 18));
      ACTION.SET_BALANCE_LP_STAKED_TRESRAVAX(hexToNumber(res[4]._hex) / Math.pow(10, 18));
    });
  };

  const getAVAXBalance = async (address, count = 3) => {
    console.log(`[useHandleNFT::getAVAXBalance]`);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider
      .getBalance(address)
      .then((balance) => ACTION.SET_BALANCE_AVAX(+ethers.utils.formatEther(balance)))
      .catch(() => (count ? getAVAXBalance(address, count - 1) : null));
  };

  const getkeyLevelP = async () => {
    console.log(`[useHandleNFT::getkeyLevelP]`);

    return await handleContracts
      .contractNFKeyStakingWithSigner()
      .portion(user?.wallet_id)
      .then((tx) => {
        ACTION.SET_KEYLEVEL_P(hexToNumber(tx?._hex) / 1e34);
      })
      .catch(() => null);
  };

  const getBonusPoolAllocation = async () => {
    return;
    console.log(`[useHandleNFT::getBonusPoolAllocation]`);

    return handleContracts.contractTresrCoinWithSigner
      .bonusPoolAllocation()
      .then((tx) => ACTION.SET_BONUS_POOL_ALLOCATION(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getPoolAllocation = async () => {
    return;

    console.log(`[useHandleNFT::getPoolAllocation]`);
    handleContracts.contractTresrCoinWithSigner.poolAllocation().then((tx) => console.log("poolAllocation", tx));

    return handleContracts.contractTresrCoinWithSigner
      .poolAllocation()
      .then((tx) => ACTION.SET_POOL_ALLOCATION(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getBurnedTresr = async () => {
    return;

    console.log(`[useHandleNFT::getBurnedTresr]`);

    return handleContracts.contractTresrCoinWithSigner
      .burned()
      .then((tx) => ACTION.SET_BURNED_TRESR(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getBurnedSmarter = async (count = 3) => {
    return;
    console.log(`[useHandleNFT::getBurnedSmarter]`);

    return handleContracts.contractNFKeyWithSigner
      .burnedSmarter()
      .then((tx) => ACTION.SET_BURNED_SMRTR(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => (count ? getAccountZone(count - 1) : null));
  };

  const getTotalSupply = async (count = 3) => {
    console.log(`[useHandleNFT::getTotalSupply]`);

    return handleContracts
      .contractNFKeyWithSigner()
      .totalSupply()
      .then((res) => hexToNumber(res?._hex))
      .catch(() => (count ? getTotalSupply(count - 1) : null));
  };
  const balanceOfSMRTR = async (address, count = 3) => {
    console.log(`[useHandleNFT::balanceOfSMRTR]`);

    return handleContracts
      .contractSmarterCoinWithSigner()
      .balanceOf(address)
      .then((tx) => ACTION.SET_BALANCE_SMRTR(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => (count ? balanceOfSMRTR(address, count - 1) : null));
  };

  const balanceOfERC20 = async (walletAddress, contractAddress, count = 3) => {
    console.log(`[useHandleNFT::balanceOfERC20]`);

    return handleContracts
      .contractERC20WithSigner(contractAddress)
      .balanceOf(walletAddress)
      .then((tx) => String(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => (count ? balanceOfERC20(walletAddress, contractAddress, count - 1) : null));
  };

  const balanceOfTRESR = async (address, count = 3) => {
    console.log(`[useHandleNFT::balanceOfTRESR]`);

    return handleContracts
      .contractTresrCoinWithSigner()
      .balanceOf(address)
      .then((tx) => ACTION.SET_BALANCE_TRESR(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => (count ? balanceOfTRESR(address, count - 1) : null));
  };

  const targetUpgradeDate = async (tokenID, count = 3) => {
    console.log(`[useHandleNFT::targetUpgradeDate] tokenID: ${tokenID}`);

    return handleContracts
      .contractNFKeyWithSigner()
      .getUpgradeDelay(tokenID)
      .then((tx) => ACTION.SET_TARGET_UPGRADE_DATE(hexToNumber(tx?._hex)))
      .catch(() => (count ? targetUpgradeDate(tokenID, count - 1) : null));
  };

  const getUpgradeDelay = async (tokenID, count = 3) => {
    console.log(`[useHandleNFT::getUpgradeDelay] tokenID: ${tokenID}`);

    return handleContracts
      .contractNFKeyWithSigner()
      .getUpgradeDelay(tokenID)
      .then((tx) => hexToNumber(tx?._hex))
      .catch(() => (count ? getUpgradeDelay(tokenID, count - 1) : null));
  };

  const getStartUpgradeDelay = async (tokenID, count = 3) => {
    // return;
    console.log(`[useHandleNFT::getStartUpgradeDelay] tokenID: ${tokenID}`);

    return handleContracts
      .contractNFKeyWithSigner()
      .getUpgradeStart(tokenID)
      .then((tx) => hexToNumber(tx?._hex))
      .catch(() => (count ? getStartUpgradeDelay(tokenID, count - 1) : null));
  };

  const getBonusReward = async (tokenList, count = 3) => {
    console.log(`[useHandleNFT::getBonusReward]`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .getBonusReward(tokenList)
      .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
      .catch(() => (count ? getBonusReward(tokenList, count - 1) : null));
  };

  const getPendingAllBaseReward = async (tokenList) => {
    console.log(`[useHandleNFT::getPendingAllBaseReward]`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .pendingAllBaseReward(tokenList)
      .then((tx) => {
        ACTION.SET_BALANCE_CALIMED_BONUS_TOTAL(+ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()));
      })
      .catch(() => {});
  };

  const getBonusRewardPerSecond = async (tokenList, count = 3) => {
    console.log(`[useHandleNFT::getBonusRewardPerSecond]`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .getBonusRewardPerSecond(tokenList)
      .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
      .catch(() => (count ? getBonusRewardPerSecond(tokenList, count - 1) : null));
  };

  const getTresrRewardsBalance = async (tokenId, count = 3) => {
    console.log(`[useHandleNFT::getTresrRewardsBalance] tokenID: ${tokenId}`);

    if (!token?.selected?.staked) return ACTION.SET_BALANCE_TRESR_REWARDS(0);
    return handleContracts
      .contractNFKeyStakingWithSigner()
      .calcRewards(tokenId)
      .then((tx) => {
        // FIXME: this is for dev
        ACTION.SET_BALANCE_TRESR_REWARDS(+ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()));
      })
      .catch(() => (count ? getTresrRewardsBalance(tokenId, count - 1) : null));
  };

  const calcRewards = async (tokenId, count = 3) => {
    console.log(`[useHandleNFT::calcRewards] tokenID: ${tokenId}`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .calcRewards(tokenId)
      .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
      .catch(() => (count ? getTresrRewardsBalance(tokenId, count - 1) : null));
  };

  const calcRewardByTokens = async (tokenList) => {
    console.log(`[useHandleNFT::calcRewardByTokens]`);
    if (tokenList?.length == 0) return [];
    console.log(`[useHandleNFT::calcRewardByTokens] tokenList: `, tokenList);
    const rewardList = await handleContracts.contractNFKeyStakingWithSigner().pendingBaseRewardByTokens(tokenList);
    return rewardList.map((reward) => +ethers.utils.formatEther(hexToNumber(reward?._hex)?.toString()));
  };

  const calcRewardsList = async (tokenList) => {
    console.log(`[useHandleNFT::calcRewardsList]`);
    if (tokenList?.length == 0) return 0;
    console.log(`[useHandleNFT::calcRewardsList] tokenList: `, tokenList);

    const rewardList = await handleContracts.contractNFKeyStakingWithSigner().pendingBaseRewardByTokens(tokenList);
    return rewardList
      .map((reward) => +ethers.utils.formatEther(hexToNumber(reward?._hex)?.toString()))
      .reduce((acc, val) => acc + val, 0);
  };

  const getRewardsReleased = async (count = 3) => {
    // if (!token?.selected?.staked) return null;
    // console.log(`[useHandleNFT::getRewardsReleased] `);
    // return handleContracts.contractNFKeyStakingWithSigner
    //   .getClaimed(token?.selected?.tokenId)
    //   .then((tx) =>
    //     ACTION.SET_BALANCE_TRESR_REWARDS_RELEASED(
    //       +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString())
    //     )
    //   )
    //   .catch(() => (count ? getRewardsReleased(count - 1) : null));
  };

  const calcRewardsPerSecond = async (tokenID, count = 3) => {
    console.log(`[useHandleNFT::calcRewardsPerSecond] tokenID: ${tokenID}`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .calcRewardsPerSecond(tokenID)
      .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
      .catch(() => (count ? calcRewardsPerSecond(count - 1) : null));
  };

  const calcRewardsListPerSecond = async (tokenIDList) => {
    console.log(`[useHandleNFT::calcRewardsListPerSecond]`);

    return (
      await Promise.all(
        tokenIDList.map((item) =>
          handleContracts
            .contractNFKeyStakingWithSigner()
            .calcRewardsPerSecond(item)
            .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
            .catch(() => 0)
        )
      )
    ).reduce((acc, val) => acc + val, 0);
  };

  const getAmountUpgradeKey = async (currentTier, count = 3) => {
    console.log(`[useHandleNFT::getAmountUpgradeKey]`);

    return handleContracts
      .contractNFKeyWithSigner()
      .getAmountUpgradeKey(currentTier)
      .then((tx) => hexToNumber(tx?._hex)?.toString() / 10 ** 18)
      .then((res) => Math.ceil(+res))
      .catch(() => (count ? getAmountUpgradeKey(currentTier, count - 1) : 0));
  };

  const getUnlockCost = async (tokenID, count = 3) => {
    console.log(`[useHandleNFT::getUnlockCost] tokenID: ${tokenID}`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .calcUnlockCost(tokenID)
      .then((tx) => +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString()))
      .catch(() => (count ? getUnlockCost(tokenID, count - 1) : 0));
  };

  const getAccountZone = async (address, zone, proof, wl, count = 3) => {
    console.log(`[useHandleNFT::getAccountZone]`);

    return handleContracts
      .contractWhitelistWithSigner()
      .getWhitelistZone(address, zone, wl, proof)
      .catch(() => (count ? getAccountZone(address, zone, count - 1, wl, proof) : null));
  };

  const getZoneCommission = async (address, zone, count = 3) => {
    console.log(`[useHandleNFT::getZoneCommission]`);

    return handleContracts
      .contractNFKeyWithSigner()
      .getZoneCommission(address, zone)
      .then((res) => hexToNumber(res?._hex))
      .catch(() => (count ? getZoneCommission(address, zone, count - 1) : null));
  };

  const timeToTreasureAvailable = async (tokenId, count = 3) => {
    // return;
    console.log(`[useHandleNFT::timeToTreasureAvailable] tokenID: ${tokenId}`);

    return handleContracts
      .contractNFKeyStakingWithSigner()
      .getTimeToTreasureUnlock(tokenId)
      .then((tx) => {
        //FIXME: 100->1000
        ACTION.SET_BALANCE_TRESR_TIME_UNLOCK(hexToNumber(tx?._hex) * 1000);
        return hexToNumber(tx?._hex);
      })
      .catch(() => (count ? timeToTreasureAvailable(tokenId, count - 1) : null));
  };

  const getProbToOpen = async (tokenId, count = 3) => {
    console.log(`[useHandleNFT::getProbToOpen] tokenID: ${tokenId}`);

    if (!token?.selected?.staked) return null;

    return (
      handleContracts
        .contractNFKeyStakingWithSigner()
        //.calcBaseProbToOpen(tokenId, nowUnix(), user?.wallet_id)
        .calcBaseProbToOpen(tokenId)
        .then((tx) => hexToNumber(tx?._hex) / 10)
        .catch(() => (count ? getProbToOpen(tokenId, count - 1) : null))
    );
  };

  const claimTresrRewards = async () => {
    await handleContracts
      .contractNFKeyStakingWithSigner()
      .withdrawTresrRewards(token?.selected?.tokenId)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          action: "claimTresrRewards",
          type: "PENDING",
          description: "Claim Tresr Rewards",
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        // await sleep(15);
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await getTresrRewardsBalance(token?.selected?.tokenId);
        // await balanceOfTRESR(user?.wallet_id);
        // getAVAXBalance(user?.wallet_id);
        // getRewardsReleased();
        updateProfileBalance();
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          action: "claimTresrRewards",
          type: "ERROR",
          error: JSON.stringify(err),
        });

        return null;
      });
  };

  const getFreeSMRTR = async () => {
    await handleContracts
      .contractSmarterCoinWithSigner()
      .faucet(user?.wallet_id)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          action: "getFreeSMRTR",
          type: "PENDING",
          description: "Faucet called",
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        // await sleep(15);
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // balanceOfSMRTR(user?.wallet_id);
        // getAVAXBalance(user?.wallet_id);
        updateProfileBalance();
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          action: "getFreeSMRTR",
          type: "ERROR",
          error: JSON.stringify(err),
        });

        return null;
      });
  };

  const approveSMRTRtoContract = async (contractAddress, amount) => {
    const sumToApprove = BigInt(amount * Math.pow(10, 18));

    return handleContracts
      .contractSmarterCoinWithSigner()
      .approve(contractAddress, sumToApprove)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "approveSMRTR",
          description: "approveSMRTR",
          tx: JSON.stringify(tx),
        });

        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        return true;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "approveSMRTR",
          error: JSON.stringify(err),
        });

        return null;
      });
  };

  const approveSMRTRByAmount = async (amount) => {
    const sumToApprove = BigInt(amount * Math.pow(10, 18));

    return handleContracts
      .contractSmarterCoinWithSigner()
      .approve(process.env.REACT_APP_NFKEY_ADDRESS, sumToApprove)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "approveSMRTR",
          description: "approveSMRTR",
          tx: JSON.stringify(tx),
        });

        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        return true;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "approveSMRTR",
          error: JSON.stringify(err),
        });

        return err;
      });
  };

  const approveSMRTR = async () => {
    if (!token?.selected?.tier) return;

    const amountUpgradeKey = await handleContracts
      .contractNFKeyWithSigner()
      .getAmountUpgradeKey(+token?.selected?.tier)
      .then((tx) => tx?._hex);
    if (!amountUpgradeKey) return;

    return handleContracts
      .contractSmarterCoinWithSigner()
      .approve(process.env.REACT_APP_NFKEY_ADDRESS, amountUpgradeKey)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "approveSMRTR",
          description: "approveSMRTR",
          tx: JSON.stringify(tx),
        });

        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        return true;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "approveSMRTR",
          error: JSON.stringify(err),
        });

        throw err;
      });
  };

  const upgradeKey = async () => {
    // const isApprove = await approveSMRTR();
    // if (!isApprove) return null;

    return handleContracts
      .contractNFKeyWithSigner()
      .upgradeKey(token?.selected?.tokenId)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "upgradeKey",
          description: "Upgraded",
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        // await sleep(15);
        await handleToken.getcheckTxEvent(tx?.hash, "KeyUpgraded");
        const _token = await handleToken.checkToken(token?.selected?.tokenId);
        if (!_token) return;
        // return;
        ACTION.SET_TOKEN_LIST_ITEM(_token);
        ACTION.SET_TOKEN_SELECTED(_token);

        // targetUpgradeDate(token?.selected?.tokenId);
        // balanceOfSMRTR(user?.wallet_id);
        // getAVAXBalance(user?.wallet_id);
        // getBurnedSmarter();
        updateProfileBalance();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, UPGRADE_KEY_ALERT(token?.selected?.tokenId, true));

        return true;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "upgradeKey",
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, UPGRADE_KEY_ALERT(token?.selected?.tokenId, false));

        return null;
      });
  };

  const bulkUpgradeKeys = async (tokenList, amountSMRTR) => {
    // const isApprove = await approveSMRTRByAmount(amountSMRTR);
    // if (!isApprove) return null;
    return handleContracts
      .contractNFKeyWithSigner()
      .bulkUpgradeKeys(tokenList)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "bulk upgradeKey",
          description: "Bulk Upgraded",
          tx: JSON.stringify(tx),
        });
        await tx.wait();

        await handleToken.getcheckTxEvent(tx?.hash, "BulkUpgraded");
        // for (const tokenItem of tokenList) {
        //   await reloadNFTItemBalance(
        //     process.env.REACT_APP_NFKEY_ADDRESS,
        //     tokenItem
        //   );
        //   ACTION.SET_ALERT(
        //     true,
        //     ALERT_STATUS_SUCCESS,
        //     UPGRADE_KEY_ALERT(tokenItem, true)
        //   );
        // }

        await loadNFTBalance(user?.wallet_id);

        for (const tokenItem of tokenList) {
          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, UPGRADE_KEY_ALERT(tokenItem, true));
        }
        // balanceOfSMRTR(user?.wallet_id);
        // getAVAXBalance(user?.wallet_id);
        // getBurnedSmarter();
        updateProfileBalance();
        return true;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "upgradeKey",
          error: JSON.stringify(err),
        });
        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, UPGRADE_KEY_ALERT(token?.selected?.tokenId, false));
        return null;
      });
  };

  const batchMint = async (zones, amounts) => {
    let commission = 0;
    for (let i = 0; i < zones.length; i++) {
      commission += (await getZoneCommission(user?.wallet_id, zones[i])) * amounts[i];
    }
    const merkle_data = await handleCustomer.getMerkleTree(user?.wallet_id);
    const merkle_proof = merkle_data[0].proof;
    const merkle_wl = {
      whitelistAddress: merkle_data[0].whitelistAddress,
      level: merkle_data[0].level,
      zone1: merkle_data[0].zone1,
      zone2: merkle_data[0].zone2,
      zone3: merkle_data[0].zone3,
      zone4: merkle_data[0].zone4,
    };

    if (commission > balance?.balanceAvax * 10 ** 18) {
      handleToastAlert.error("Insufficient balance");

      new AirdropApi().logger({
        wallet_id: user?.wallet_id,
        type: "ERROR",
        action: "mint",
        description: "Insufficient balance",
        error: JSON.stringify("Insufficient balance"),
      });

      return;
    }
    return handleContracts
      .contractNFKeyWithSigner()
      .batchMint(user?.wallet_id, zones, amounts, merkle_wl, merkle_proof, {
        value: commission.toString(),
      })
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "mint",
          description: "HomeMint batch token",
          tx: JSON.stringify(tx),
        });

        const answer = await tx.wait();
        await handleToken.getcheckTxEvent(tx?.hash, "BatchMinted");

        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);
        const transactionLogList = answer?.logs?.filter((log) => log?.address === process.env.REACT_APP_NFKEY_ADDRESS);

        await loadNFTBalance(user?.wallet_id);

        // for (const transactionLog of transactionLogList) {
        //   const tokenID = parseInt(transactionLog?.topics[3], 16);
        //   // FIXME: should remove this
        //   if (+tokenID > 0 && +tokenID < 10000)
        //     await reloadNFTItemBalance(
        //       process.env.REACT_APP_NFKEY_ADDRESS,
        //       tokenID
        //     );
        // }
        console.log("useHandleNFT::transactionLogList", transactionLogList);
        return transactionLogList;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "mint",
          description: "HomeMint unique token",
          error: JSON.stringify(err),
        });
      });
  };

  const mint = async (zone, amount) => {
    alert("this should be fixed");
    const commission = await getZoneCommission(user?.wallet_id, zone);
    const merkle_data = await handleCustomer.getMerkleTree(user?.wallet_id);
    const merkle_proof = merkle_data[0].proof;
    const merkle_wl = {
      whitelistAddress: merkle_data[0].whitelistAddress,
      level: merkle_data[0].level,
      zone1: merkle_data[0].zone1,
      zone2: merkle_data[0].zone2,
      zone3: merkle_data[0].zone3,
      zone4: merkle_data[0].zone4,
    };

    if (commission * amount > balance?.balanceAvax * 10 ** 18) {
      handleToastAlert.error("Insufficient balance");

      new AirdropApi().logger({
        wallet_id: user?.wallet_id,
        type: "ERROR",
        action: "mint",
        description: "Insufficient balance",
        error: JSON.stringify("Insufficient balance"),
      });

      return;
    }
    return handleContracts
      .contractNFKeyWithSigner()
      .bulkMint(user?.wallet_id, zone, amount, merkle_wl, merkle_proof, {
        value: (commission * amount).toString(),
      })
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "mint",
          description: "HomeMint unique token",
          tx: JSON.stringify(tx),
        });

        const answer = await tx.wait();
        await handleToken.getcheckTxEvent(tx?.hash, "BatchMinted");
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);
        const transactionLogList = answer?.logs?.filter((log) => log?.address === process.env.REACT_APP_NFKEY_ADDRESS);

        for (const transactionLog of transactionLogList) {
          const tokenID = parseInt(transactionLog?.topics[3], 16);
          // FIXME: should remove this
          if (+tokenID > 0 && +tokenID < 10000)
            await reloadNFTItemBalance(process.env.REACT_APP_NFKEY_ADDRESS, tokenID);
        }

        return transactionLogList;
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "mint",
          description: "HomeMint unique token",
          error: JSON.stringify(err),
        });
      });
  };

  const bulkStake = async (tokenList) => {
    await handleContracts
      .contractNFKeyStakingWithSigner()
      .bulkStake(tokenList)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "bulkStakeNFT",
          description: `tokenIds: ${tokenList?.join(",")}`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        // await sleep(15);
        await handleToken.getcheckTxEvent(tx?.hash, "BulkStaked");
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // TODO: just get entire token list from the backend
        // for (const tokenItem of tokenList) {
        //   await reloadNFTItemBalance(
        //     process.env.REACT_APP_NFKEY_ADDRESS,
        //     tokenItem
        //   );
        //   ACTION.SET_ALERT(
        //     true,
        //     ALERT_STATUS_SUCCESS,
        //     ACTIVATE_KEY_ALERT(tokenItem, true)
        //   );
        // }
        await loadNFTBalance(user?.wallet_id);
        for (const tokenItem of tokenList) {
          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, ACTIVATE_KEY_ALERT(tokenItem, true));
        }
        // await getAVAXBalance(user?.wallet_id);
        updateProfileBalance();
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "bulkStakeNFT",
          description: `tokenIds: ${tokenList?.join(",")}`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, ACTIVATE_KEY_ALERT(token?.selected?.tokenId, false));

        return null;
      });
  };

  const stake = async () => {
    await handleContracts
      .contractNFKeyStakingWithSigner()
      .stake(token?.selected?.tokenId)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "stakeNFT",
          description: `tokenId: ${token?.selected?.tokenId}`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        await handleToken.getcheckTxEvent(tx?.hash, "Staked");

        const _token = await handleToken.checkToken(token?.selected?.tokenId);
        console.log("[useHandleNFT::stake] token:", _token);
        if (!_token) return;
        ACTION.SET_TOKEN_LIST_ITEM(_token);
        ACTION.SET_TOKEN_SELECTED(_token);

        // ACTION.SET_CURRENT_TOKEN(_token);
        // if (_token?.owner === user?.wallet_id) {
        //   ACTION.SET_TOKEN_SELECTED(_token);
        // }

        ACTION.SET_TRANSANCTION_HASH(tx?.hash);

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, ACTIVATE_KEY_ALERT(token?.selected?.tokenId, true));
        // getAVAXBalance(user?.wallet_id);
        // getkeyLevelP();
        updateProfileBalance();
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "stakeNFT",
          description: `tokenId: ${token?.selected?.tokenId}`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, ACTIVATE_KEY_ALERT(token?.selected?.tokenId, false));

        return null;
      });
  };

  const unstake = async () => {
    await handleContracts
      .contractNFKeyStakingWithSigner()
      .unstake(token?.selected?.tokenId)
      .then(async (tx) => {
        await new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "unstakeNFT",
          description: `tokenId: ${token?.selected?.tokenId}`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        // await sleep(15);
        const _token = await handleToken.checkToken(token?.selected?.tokenId);
        console.log("[useHandleNFT::stake] token:", _token);
        if (!_token) return;
        // return;
        ACTION.SET_TOKEN_LIST_ITEM(_token);
        ACTION.SET_TOKEN_SELECTED(_token);

        // ACTION.SET_CURRENT_TOKEN(_token);
        // if (_token?.owner === user?.wallet_id) {
        //   ACTION.SET_TOKEN_SELECTED(_token);
        // }

        ACTION.SET_TRANSANCTION_HASH(tx?.hash);

        // getAVAXBalance(user?.wallet_id);
        // getkeyLevelP();
        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, DEACTIVATE_KEY_ALERT(token?.selected?.tokenId, true));
        updateProfileBalance();
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "unstakeNFT",
          description: `tokenId: ${token?.selected?.tokenId}`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, DEACTIVATE_KEY_ALERT(token?.selected?.tokenId, false));

        return null;
      });
  };

  const unlockTreasure = async () => {
    return handleContracts
      .contractNFKeyStakingWithSigner()
      .openChest(token?.selected?.tokenId)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "openChest",
          description: `tokenId: ${token?.selected?.tokenId}`,
          tx: JSON.stringify(tx),
        });
        const transaction = await tx.wait();
        // await sleep(15);

        await handleToken.getcheckTxEvent(tx?.hash, "Opened");

        const _token = await handleToken.checkToken(token?.selected?.tokenId);
        if (!_token) return;
        // return;
        ACTION.SET_TOKEN_LIST_ITEM(_token);
        ACTION.SET_TOKEN_SELECTED(_token);

        ACTION.SET_TRANSANCTION_HASH(tx?.hash);

        const event = transaction?.events?.find((item) => item?.event === "Opened");
        const statusChest = event?.args[2];

        // await reloadNFTItemBalance(
        //   token?.selected?.contractAddress,
        //   token?.selected?.tokenId
        // );
        updateProfileBalance();
        // await Promise.all([
        //   timeToTreasureAvailable(token?.selected?.tokenId),
        //   getTresrRewardsBalance(token?.selected?.tokenId),
        //   balanceOfTRESR(user?.wallet_id),
        //   getAVAXBalance(user?.wallet_id),
        // ]);
        // console.log("after await");
        return statusChest;
      })
      .catch(async (err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "openChest",
          description: `tokenId: ${token?.selected?.tokenId}`,
          error: JSON.stringify(err),
        });

        const _token = await handleToken.checkToken(token?.selected?.tokenId);
        if (!_token) return;
        // return;
        ACTION.SET_TOKEN_LIST_ITEM(_token);
        ACTION.SET_TOKEN_SELECTED(_token);
        updateProfileBalance();

        // await reloadNFTItemBalance(
        //   token?.selected?.contractAddress,
        //   token?.selected?.tokenId
        // );
        // await Promise.all([
        //   timeToTreasureAvailable(token?.selected?.tokenId),
        //   getTresrRewardsBalance(token?.selected?.tokenId),
        //   balanceOfTRESR(user?.wallet_id),
        //   getAVAXBalance(user?.wallet_id),
        // ]);

        throw err;
      });
  };

  const reloadNFTItemBalance = async (contractAddress, tokenID) => {
    console.log(`[useHandleNFT::reloadNFTItemBalance]`);

    if (!user?.wallet_id) return;
    const isKeyContract = contractAddress?.toLowerCase() === process.env.REACT_APP_NFKEY_ADDRESS?.toLowerCase();

    const token = await handleToken.checkToken(tokenID);
    console.log("[useHandleNFT::reloadNFTItemBalance]", token);
    if (!token) return;
    // return;
    ACTION.SET_TOKEN_LIST_ITEM(token);
    ACTION.SET_CURRENT_TOKEN(token);
    if (token?.owner === user?.wallet_id) {
      ACTION.SET_TOKEN_SELECTED(token);
    }
  };

  const loadNFTBalance = async (contractAddress) => {
    // return;
    console.log(`[useHandleNFT::loadNFTBalance]`);

    if (user?.wallet_id) {
      // get currently selected
      const tokenList = await handleToken.getTokenList(contractAddress);

      if (!tokenList?.length) return;
      // console.log("[useHandleNFT.js::loadNFTBalance] SET_TOKEN_SELECTED");
      ACTION.SET_TOKEN_LIST(tokenList);

      // ACTION.SET_TOKEN_LIST([tokenList[0], tokenList[1]]);
    }
  };

  return {
    getNFkeyInfo,
    updateProfileBalance,
    getTotalSupply,
    getUnlockCost,
    getAmountUpgradeKey,
    loadNFTBalance,
    reloadNFTItemBalance,
    balanceOfSMRTR,
    balanceOfTRESR,
    getAVAXBalance,
    getFreeSMRTR,
    approveSMRTR,
    bulkUpgradeKeys,
    upgradeKey,
    timeToTreasureAvailable,
    unlockTreasure,
    stake,
    bulkStake,
    unstake,
    getTresrRewardsBalance,
    claimTresrRewards,
    getRewardsReleased,
    getProbToOpen,
    mint,
    batchMint,
    approveSMRTRtoContract,
    balanceOfERC20,
    getAccountZone,
    getZoneCommission,
    calcRewardsPerSecond,
    calcRewards,
    calcRewardByTokens,
    calcRewardsList,
    calcRewardsListPerSecond,
    getBonusReward,
    getBonusRewardPerSecond,
    getBurnedTresr,
    getBurnedSmarter,
    targetUpgradeDate,
    getBonusPoolAllocation,
    getPoolAllocation,
    getUpgradeDelay,
    getStartUpgradeDelay,
    approveSMRTRByAmount,
    getPendingAllBaseReward,
    getkeyLevelP,
  };
}
