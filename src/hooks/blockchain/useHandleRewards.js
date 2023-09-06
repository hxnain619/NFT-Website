import { useContext, useState, useMemo } from "react";
import { Context } from "../../store";
import { hexToNumber } from "../../utils/blockchain";
import useHandleContracts from "./useHandleContracts";
import { nowUnix, sleep } from "../../utils";
import AirdropApi from "../../api/AirdropApi";
import useHandleNFT from "./useHandleNFT";
import {
  ALERT_STATUS_FAILURE,
  ALERT_STATUS_SUCCESS,
  CLAIM_ALL_REWARDS_ALERT,
  CLAIM_BONUS_REWARDS_ALERT,
  CLAIM_FOUNDERS_REWARDS_ALERT,
  CLAIM_ALL_FOUNDERS_REWARDS_ALERT,
} from "../../constant/alert";
import { parseEther } from "ethers/lib/utils";

export default function useHandleRewards() {
  const [{ user, token }, ACTION] = useContext(Context);

  const handleContracts = useHandleContracts();
  const handleNFT = useHandleNFT();

  const [jlpSmrtBonusRewardPerSecond, setJlpSmrtBonusRewardPerSecond] = useState(0);
  const [jlpTresrBonusRewardPerSecond, setJlpTresrBonusRewardPerSecond] = useState(0);
  const [veTresrBonusRewardPerSecond, setVeTresrBonusRewardPerSecond] = useState(0);
  const [keyLevelBonusRewardPerSecond, setKeyLevelBonusRewardPerSecond] = useState(0);

  const updateClaimableBonusRewardBalance = async () => {
    // return;
    Promise.all([
      handleContracts.contractDailyBonusRewardsWithSigner().getVeTresrBonusReward(user?.wallet_id),
      handleContracts.contractDailyBonusRewardsWithSigner().getJlpSmrtBonusReward(user?.wallet_id),
      handleContracts.contractDailyBonusRewardsWithSigner().getJlpTresrBonusReward(user?.wallet_id),
      handleContracts.contractDailyBonusRewardsWithSigner().getKeyLevelBonusReward(user?.wallet_id),
    ]).then((res) => {
      ACTION.SET_BALANCE_BONUS_VETRESR_REWARDS(hexToNumber(res[0]?._hex) / 10 ** 18);
      ACTION.SET_BALANCE_BONUS_JLPSMARTR_REWARDS(hexToNumber(res[1]?._hex) / 10 ** 18);
      ACTION.SET_BALANCE_BONUS_JLPTRESR_REWARDS(hexToNumber(res[2]?._hex) / 10 ** 18);
      ACTION.SET_BALANCE_BONUS_KEY_LEVEL_REWARDS(hexToNumber(res[3]?._hex) / 10 ** 18);
    });
  };

  const getRewardDashboardInfo = async (address) => {
    return Promise.all([
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .getRewardPerSecond(address)
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
      handleContracts.contractTresrStakingCoinWithSigner().pendingVeTresr(address),
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .getStaked(address)
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .totalStaked()
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .veTresrPerHour(address)
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .maxVeTresr(address)
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
      handleContracts
        .contractTresrStakingCoinWithSigner()
        .daysToMax(address)
        .then((tx) => hexToNumber(tx?._hex) / 10 ** 18),
    ]);
  };

  const getEstDailyBonusReward = async (count = 3) => {
    return Promise.all([
      handleContracts.contractDailyBonusRewards().getEstDailyBonusReward(user?.wallet_id),
      handleContracts.contractDailyBonusRewards().getEstMonthlyBonusReward(user?.wallet_id),
    ]).then((res) => {
      console.log("[useHandleReward::getEstDailyBonusReward]", res);

      return [hexToNumber(res[0]?._hex), hexToNumber(res[1]?._hex)];
    });
  };

  const getVeTresrBonusReward = async () => {
    if (!user?.wallet_id) return;

    console.log(`[useHandleReward::getVeTresrBonusReward]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getVeTresrBonusReward(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_BONUS_VETRESR_REWARDS(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getJlpTresrBonusReward = async () => {
    if (!user?.wallet_id) return;

    console.log(`[useHandleReward::getJlpTresrBonusReward]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getJlpTresrBonusReward(user?.wallet_id)
      .then((tx) => {
        ACTION.SET_BALANCE_BONUS_JLPTRESR_REWARDS(hexToNumber(tx?._hex) / 10 ** 18);
      })
      .catch(() => null);
  };

  const getJlpSmrtBonusReward = async () => {
    if (!user?.wallet_id) return;

    console.log(`[useHandleReward::getJlpSmrtBonusReward]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getJlpSmrtBonusReward(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_BONUS_JLPSMARTR_REWARDS(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getKeyLevelBonusReward = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getKeyLevelBonusReward]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getKeyLevelBonusReward(user?.wallet_id)
      .then((tx) => {
        ACTION.SET_BALANCE_BONUS_KEY_LEVEL_REWARDS(hexToNumber(tx?._hex) / 10 ** 18);
      })
      .catch(() => null);
  };

  const getJlpTresrBonusRewardPerSecond = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getJlpTresrBonusRewardPerSecond]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getJlpTresrBonusRewardPerSecond()
      .then((tx) => setJlpTresrBonusRewardPerSecond(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getVeTresrPerHour = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getVeTresrPerHour]`);

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .veTresrPerHour(user.wallet_id)
      .then((res) => {
        // TODO: set veTresr/hour value
        return res._hex / 1e18;
      })
      .catch(() => null);
  };

  const getMaxVeTresr = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getMaxVeTresr]`);

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .maxVeTresr(user.wallet_id)
      .then((res) => {
        // TODO: set Max Vetresr value
        return res._hex / 1e18;
      })
      .catch(() => null);
  };

  const getDaysToMax = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getDaysToMax]`);

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .daysToMax(user.wallet_id)
      .then((res) => {
        // TODO: set Max Vetresr value
        return hexToNumber(res._hex);
      })
      .catch(() => null);
  };
  const updateBurnedEmissionInfo = async () => {
    // return;
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::updateBurnedEmissionInfo]`);
    Promise.all([
      handleContracts.contractDailyBonusRewards().burned(),
      handleContracts.contractDailyBonusRewards().emission(),
    ]).then((res) => {
      ACTION.SET_BURNED_SMRTR(res[0][0]._hex / 1e18);
      ACTION.SET_BURNED_TRESR(res[0][1]._hex / 1e18);
      ACTION.SET_POOL_ALLOCATION(res[1][0]._hex / 1e18);
      ACTION.SET_BONUS_POOL_ALLOCATION(res[1][1]._hex / 1e18);
      return res;
    });
  };
  const getBurned = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getBurned]`);

    return handleContracts
      .contractDailyBonusRewards()
      .burned()
      .then((res) => {
        // TODO: set Smtr & Tresr Burned value
        ACTION.SET_BURNED_SMRTR(res[0]._hex / 1e18);
        ACTION.SET_BURNED_TRESR(res[1]._hex / 1e18);

        return res;
      })
      .catch(() => null);
  };

  const getEmission = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getEmission]`);

    return handleContracts
      .contractDailyBonusRewards()
      .emission()
      .then((res) => {
        // TODO: set Base & Bonus pool Tresr emission value
        ACTION.SET_POOL_ALLOCATION(res[0]._hex / 1e18);
        ACTION.SET_BONUS_POOL_ALLOCATION(res[1]._hex / 1e18);
        return res;
      })
      .catch(() => null);
  };

  const getCumulativeLevels = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getCumulativeLevels]`);

    return handleContracts
      .contractDailyBonusRewards()
      .cumulatedKeys(user.wallet_id)
      .then((res) => {
        // TODO: set cumulated levels value
        return hexToNumber(res._hex);
      })
      .catch(() => null);
  };

  const getPenddingBonusRewards = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getPenddingBonusRewards]`);

    return handleContracts
      .contractDailyBonusRewards()
      .pendingBonusReward(user?.wallet_id)
      .then((res) => {
        // TODO: set cumulated levels value
        return hexToNumber(res?._hex) / 1e18;
      })
      .catch(() => null);
  };

  const getPendingTotalRewards = async (count = 3) => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getPendingTotalRewards]`);
    if (token?.list?.length == 0) return 0;
    const ownTokenList = token?.list?.filter((item) => item?.owner === user?.wallet_id)?.map((item) => +item?.tokenId);
    console.log("pendingTotalReward::ownTokenList", token?.list);
    console.log("pendingTotalReward::walletid", user?.wallet_id);
    return handleContracts
      .contractDailyBonusRewards()
      .pendingTotalReward(user?.wallet_id, ownTokenList)
      .then((res) => hexToNumber(res?._hex) / 1e18)
      .catch(() => (count ? getPendingTotalRewards(count - 1) : null));
    // const res = await handleContracts.contractDailyBonusRewards().pendingTotalReward(user?.wallet_id, ownTokenList);
    // return hexToNumber(res?._hex) / 1e18;
  };

  const getJlpSmrtBonusRewardPerSecond = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getJlpSmrtBonusRewardPerSecond]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getJlpSmrtBonusRewardPerSecond()
      .then((tx) => setJlpSmrtBonusRewardPerSecond(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getVeTresrBonusRewardPerSecond = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getVeTresrBonusRewardPerSecond]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getVeTresrBonusRewardPerSecond()
      .then((tx) => setVeTresrBonusRewardPerSecond(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getKeyLevelBonusRewardPerSecond = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getKeyLevelBonusRewardPerSecond]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .getKeyLevelBonusRewardPerSecond()
      .then((tx) => setKeyLevelBonusRewardPerSecond(hexToNumber(tx?._hex) / 10 ** 18))
      .catch(() => null);
  };

  const getTotalRewards = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getTotalRewards]`);

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .totalPortion(user?.wallet_id)
      .then(async (res) => {
        // Todo: set unclaimable veTresr Balance
        //console.log(res._hex / 1e36);
        return res._hex / 1e34;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPendingVeTresr = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getPendingVeTresr]`);

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .pendingVeTresr(user?.wallet_id)
      .then(async (res) => {
        // Todo: set unclaimable veTresr Balance
        return res._hex / 1e18;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClaimedVeTresr = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleReward::getClaimedVeTresr]`);

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .stakedBalanceOf(user?.wallet_id)
      .then(async (res) => {
        // Todo: set unclaimable veTresr Balance
        return res._hex / 1e18;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const claimVeTresr = async () => {
    if (!user?.wallet_id) return;
    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .claimVeTresr()
      .then(async (tx) => {
        await tx.wait();
      });
  };

  const claimBonus = async () => {
    if (!user?.wallet_id) return;

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .claimBonusReward()
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "claimBonus",
          description: `Claimed bonus`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);

        // FIXME: should make one update
        // handleNFT.balanceOfTRESR(user?.wallet_id);
        // handleNFT.getAVAXBalance(user?.wallet_id);
        handleNFT.getBonusPoolAllocation();
        handleNFT.updateProfileBalance();
        // FIXME: should make one update
        // getKeyLevelBonusReward();
        // getJlpSmrtBonusReward();
        // getJlpTresrBonusReward();
        // getVeTresrBonusReward();
        updateClaimableBonusRewardBalance();

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, CLAIM_BONUS_REWARDS_ALERT(true));
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "claimBonus",
          description: `Claimed bonus`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, CLAIM_BONUS_REWARDS_ALERT(false));

        return null;
      });
  };

  const claimBase = async () => {
    if (!user?.wallet_id) return;
    if (!token?.selected?.tokenId) return;

    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .claimBase(token?.selected?.tokenId)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "claimBase",
          description: `Claimed base`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);

        // handleNFT.getRewardsReleased();
        // handleNFT.balanceOfTRESR(user?.wallet_id);
        // handleNFT.getAVAXBalance(user?.wallet_id);
        handleNFT.getPoolAllocation();
        handleNFT.updateProfileBalance();

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, CLAIM_FOUNDERS_REWARDS_ALERT(true));
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "claimBase",
          description: `Claimed base`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, CLAIM_FOUNDERS_REWARDS_ALERT(false));

        return null;
      });
  };

  const claimAllBase = async () => {
    if (!user?.wallet_id) return;
    if (!token?.selected?.tokenId) return;

    const tokenIdList = token?.list?.filter((item) => item?.staked == true)?.map((item) => item.tokenId);
    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .claimAllBaseReward(tokenIdList)
      .then(async (tx) => {
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);

        // FIXME: use single udpate function
        // handleNFT.getRewardsReleased();
        // handleNFT.balanceOfTRESR(user?.wallet_id);
        // handleNFT.getAVAXBalance(user?.wallet_id);
        handleNFT.getPoolAllocation();
        handleNFT.updateProfileBalance();
        handleNFT.getPendingAllBaseReward(tokenIdList);

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, CLAIM_FOUNDERS_REWARDS_ALERT(true));
      })
      .catch((err) => {
        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, CLAIM_FOUNDERS_REWARDS_ALERT(false));

        return null;
      });
  };

  const claimAll = async () => {
    if (!user?.wallet_id) return;

    const ownTokenList = token?.list
      ?.filter((item) => item?.owner === user?.wallet_id)
      ?.filter((item) => item?.staked == true)
      ?.map((item) => +item?.tokenId);
    return handleContracts
      .contractDailyBonusRewardsWithSigner()
      .claimAll(ownTokenList)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "claimAll",
          description: `Claimed all`,
          tx: JSON.stringify(tx),
        });
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);
        //FIXME: should use just one hooks
        // handleNFT.getRewardsReleased();
        // handleNFT.balanceOfTRESR(user?.wallet_id);
        // handleNFT.getAVAXBalance(user?.wallet_id);
        handleNFT.getBonusPoolAllocation();
        handleNFT.getPoolAllocation();
        handleNFT.getTresrRewardsBalance();
        handleNFT.updateProfileBalance();

        updateClaimableBonusRewardBalance();

        // getKeyLevelBonusReward();
        // getJlpSmrtBonusReward();
        // getJlpTresrBonusReward();
        // getVeTresrBonusReward();

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, CLAIM_ALL_REWARDS_ALERT(true));
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "claimAll",
          description: `Claimed all`,
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, CLAIM_ALL_REWARDS_ALERT(false));

        return null;
      });
  };

  const getMasterChefRewards = async (id) => {
    if (!user?.wallet_id) return;

    // const time = nowUnix() + 400;

    // return handleContracts.contractMasterChefWithSigner
    //   .pendingTokens(id, user?.wallet_id, time)
    //   .then((tx) => {
    //     const res = hexToNumber(tx?.result?._hex) / 10 ** 18;

    //     if (id === 0) ACTION.SET_BALANCE_BONUS_JLPSMARTR_REWARDS(res);
    //     else if (id === 1) ACTION.SET_BALANCE_BONUS_JLPTRESR_REWARDS(res);

    //     return res;
    //   })
    //   .catch(() => null);
  };

  const depositMasterChef = async (id, amount) => {
    if (!user?.wallet_id) return;

    // const amountEther = parseEther(amount?.toString()).toString();
    // return handleContracts.contractMasterChefWithSigner
    //     .deposit(id, amountEther)
    //     .then(async (tx) => {
    //         await tx.wait();
    //          ACTION.SET_TRANSANCTION_HASH(tx?.hash);
    //         // await sleep(15);

    //         getMasterChefRewards(id);
    //     })
    //     .catch(() => null);
  };

  const withdrawMasterChef = (id, amount) => {
    if (!user?.wallet_id) return;

    const amountEther = parseEther(amount?.toString()).toString();
    return handleContracts
      .contractMasterChefWithSigner()
      .withdraw(id, amountEther)
      .then(async (tx) => {
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);

        getMasterChefRewards(id);
      })
      .catch(() => null);
  };

  return {
    updateClaimableBonusRewardBalance,
    updateBurnedEmissionInfo,
    getRewardDashboardInfo,
    getMasterChefRewards,
    depositMasterChef,
    withdrawMasterChef,
    claimVeTresr,
    claimBonus,
    claimBase,
    claimAllBase,
    claimAll,
    getEstDailyBonusReward,
    getVeTresrBonusReward,
    getJlpTresrBonusReward,
    getJlpSmrtBonusReward,
    getKeyLevelBonusReward,
    getVeTresrBonusRewardPerSecond,
    getJlpTresrBonusRewardPerSecond,
    getJlpSmrtBonusRewardPerSecond,
    getKeyLevelBonusRewardPerSecond,
    getPendingVeTresr,
    getTotalRewards,
    getClaimedVeTresr,
    getVeTresrPerHour,
    getMaxVeTresr,
    getDaysToMax,
    getBurned,
    getEmission,
    getCumulativeLevels,
    getPenddingBonusRewards,
    getPendingTotalRewards,
    jlpSmrtBonusRewardPerSecond,
    jlpTresrBonusRewardPerSecond,
    veTresrBonusRewardPerSecond,
    keyLevelBonusRewardPerSecond,
  };
}
