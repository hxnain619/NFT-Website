import { useContext, useMemo } from "react";
import { Context } from "../../store";
import { ethers } from "ethers";
import AirdropApi from "../../api/AirdropApi";
import useHandleToastAlert from "../alert/useHandleToastAlert";
import { hexToNumber } from "../../utils/blockchain";
import useHandleContracts from "./useHandleContracts";
import { nowUnix, sleep } from "../../utils";
import useHandleNFT from "./useHandleNFT";
import {
  ALERT_STATUS_FAILURE,
  ALERT_STATUS_SUCCESS,
  STAKE_TRESR,
  UNSTAKE_TRESR,
} from "../../constant/alert";
import useHandleRewards from "./useHandleRewards";

export default function useHandleTresrStaking() {
  const [{ user, balance }, ACTION] = useContext(Context);

  const handleToastAlert = useHandleToastAlert();
  const handleContracts = useHandleContracts();
  const handleNFT = useHandleNFT();
  const handleRewards = useHandleRewards();

  const approveTRESR = async (value) => {
    if (value > balance?.balanceTresr)
      return handleToastAlert.error("Empty balance");

    const balanceWei = ethers.utils.parseUnits(value.toString(), "ether");
    if (!+balanceWei) return handleToastAlert.error("Empty balance");

    return handleContracts
      .contractTresrCoinWithSigner()
      .approve(process.env.REACT_APP_TRESR_STAKING_ADDRESS, balanceWei)
      .then(async (tx) => {
        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        return true;
      })
      .catch((err) => {
        throw err;
      });
  };

  const getTresrStaked = async () => {
    console.log(`[useHandleTresrStaking::getTresrStaked]`);

    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .getStaked(user?.wallet_id)
      .then((tx) => hexToNumber(tx?._hex) / 10 ** 18)
      .then((balance) => {
        ACTION.SET_BALANCE_TRESR_STAKED(balance);
        return balance;
      })
      .catch(() => null);
  };

  const getTresrTotalStaked = async () => {
    console.log(`[useHandleTresrStaking::getTresrTotalStaked]`);

    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .totalStaked()
      .then((tx) => hexToNumber(tx?._hex) / 10 ** 18)
      .then((balance) => {
        ACTION.SET_BALANCE_TRESR_STAKED_ALL(balance);
        return balance;
      })
      .catch(() => null);
  };

  const getTresrRewardsPerSec = async () => {
    console.log(`[useHandleTresrStaking::getTresrRewardsPerSec]`);

    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .getRewardPerSecond(user?.wallet_id)
      .then((tx) =>
        ACTION.SET_BALANCE_TRESR_REWARDS_PER_SEC(
          ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString())
        )
      )
      .catch(() => null);
  };

  const getTresrStakedAll = async () => {
    console.log(`[useHandleTresrStaking::getTresrStakedAll]`);

    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .getStakedAll()
      .then((tx) => hexToNumber(tx?._hex) / 10 ** 18)
      .catch(() => null);
  };

  const getveTresrShareP = async () => {
    console.log(`[useHandleTresrStaking::getveTresrShareP]`);
    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .portion(user?.wallet_id)
      .then((tx) => {
        ACTION.SET_VETRESR_SHARE_P(hexToNumber(tx?._hex) / 1e34);
      })
      .catch(() => null);
  };

  const getTotalEarned = async () => {
    console.log(`[useHandleTresrStaking::getTotalEarned]`);
    return await handleContracts
      .contractTresrStakingCoinWithSigner()
      .getReward(nowUnix())
      .then((tx) =>
        ACTION.SET_BALANCE_TOTAL_EARNED(
          +ethers.utils.formatEther(hexToNumber(tx?._hex)?.toString())
        )
      )
      .catch(() => null);
  };

  const stakeTresr = async (value) => {
    if (value > balance?.balanceTresr)
      return handleToastAlert.error("Empty balance");

    const balanceWei = ethers.utils.parseUnits(value.toString(), "ether");
    if (!+balanceWei) return handleToastAlert.error("Empty balance");

    // const isApprove = await approveTRESR(balanceWei);
    // if (!isApprove) return null;

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .stake(balanceWei)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "stakeTRESR",
          description: "stakeTRESR",
          tx: JSON.stringify(tx),
        });

        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);

        getTresrStaked();
        getTresrRewardsPerSec();
        getTotalEarned();
        getveTresrShareP();
        handleRewards.getVeTresrBonusReward();
        handleNFT.balanceOfTRESR(user?.wallet_id);

        handleToastAlert.success("$TRESR staked");

        ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, STAKE_TRESR(true, value));
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "stakeTRESR",
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, STAKE_TRESR(false, value));

        return null;
      });
  };

  const unstakeTresr = async (value) => {
    if (value > balance?.balanceTresrStaked)
      return handleToastAlert.error("Empty staking balance");

    const amountWei = ethers.utils.parseUnits(value.toString(), "ether");
    if (!+amountWei) return handleToastAlert.error("Empty staking balance");

    return handleContracts
      .contractTresrStakingCoinWithSigner()
      .unstake(amountWei)
      .then(async (tx) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "PENDING",
          action: "unstakeTRESR",
          description: "unstakeTRESR",
          tx: JSON.stringify(tx),
        });

        await tx.wait();
        ACTION.SET_TRANSANCTION_HASH(tx?.hash);
        // await sleep(15);

        getTresrStaked();
        getTresrRewardsPerSec();
        getTotalEarned();
        getveTresrShareP();
        handleRewards.getVeTresrBonusReward();
        handleNFT.balanceOfTRESR(user?.wallet_id);

        handleToastAlert.success("$TRESR unstaked");

        ACTION.SET_ALERT(
          true,
          ALERT_STATUS_SUCCESS,
          UNSTAKE_TRESR(true, value)
        );
      })
      .catch((err) => {
        new AirdropApi().logger({
          wallet_id: user?.wallet_id,
          type: "ERROR",
          action: "unstakeTRESR",
          error: JSON.stringify(err),
        });

        ACTION.SET_ALERT(
          true,
          ALERT_STATUS_FAILURE,
          UNSTAKE_TRESR(false, value)
        );

        return null;
      });
  };

  return {
    getTresrStaked,
    getTresrTotalStaked,
    getTresrRewardsPerSec,
    getTotalEarned,
    getTresrStakedAll,
    stakeTresr,
    unstakeTresr,
    approveTRESR,
    getveTresrShareP,
  };
}
