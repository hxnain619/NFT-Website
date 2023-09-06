import { useContext, useMemo } from "react";
import { Context } from "../../store";
import { parseEther } from "ethers/lib/utils";
import { hexToNumber } from "../../utils/blockchain";
import useHandleContracts from "./useHandleContracts";
import useHandleRewards from "./useHandleRewards";
import AirdropApi from "api/AirdropApi";
import {
  ALERT_STATUS_FAILURE,
  ALERT_STATUS_SUCCESS,
  STAKE_SMRTR_LP_ALERT,
  STAKE_TRESR_LP_ALERT,
  UNSTAKE_SMRTR_LP_ALERT,
  UNSTAKE_TRESR_LP_ALERT,
} from "constant/alert";

export default function useHandleLpStaking() {
  const [{ user }, ACTION] = useContext(Context);

  const handleContracts = useHandleContracts();
  const handleRewards = useHandleRewards();
  const approveLP = async (balance, isTRESR = true) => {
    if (isTRESR) {
      return (
        handleContracts
          .contractLpCoinTRESRAVAXWithSigner()
          // .approve(process.env.REACT_APP_LP_TRESRAVAX_STAKING_ADDRESS, parseEther(balance?.toString()).toString())
          .approve(process.env.REACT_APP_LP_TRESRAVAX_STAKING_ADDRESS, parseEther(balance?.toString()).toString())
          .then(async (tx) => {
            await tx.wait();
            ACTION.SET_TRANSANCTION_HASH(tx?.hash);
            return true;
          })
          .catch((err) => {
            throw err;
          })
      );
    } else {
      return (
        handleContracts
          .contractLpCoinSMRTRAVAXWithSigner()
          // .approve(process.env.REACT_APP_LP_SMRTRAVAX_STAKING_ADDRESS, parseEther(balance?.toString()).toString())
          .approve(process.env.REACT_APP_LP_SMRTRAVAX_STAKING_ADDRESS, parseEther(balance?.toString()).toString())
          .then(async (tx) => {
            await tx.wait();
            ACTION.SET_TRANSANCTION_HASH(tx?.hash);
            return true;
          })
          .catch((err) => {
            throw err;
          })
      );
    }
  };

  const balanceOfLp = async () => {
    console.log(`[useHandleLpStaking::balanceOfLp]`);

    await handleContracts
      .contractLpCoinTRESRAVAXWithSigner()
      .balanceOf(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_LP_TRESRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => null);

    await handleContracts
      .contractLpCoinSMRTRAVAXWithSigner()
      .balanceOf(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_LP_SMRTRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => null);
  };

  const balanceOfStakedLp = async () => {
    if (!user?.wallet_id) return;
    console.log(`[useHandleLpStaking::balanceOfStakedLp]`);

    await handleContracts
      .contractLpStakingTRESRAVAXWithSigner()
      .stakedBalanceOf(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_LP_STAKED_TRESRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => null);

    await handleContracts
      .contractLpStakingTRESRAVAXWithSigner()
      .portion(user?.wallet_id)
      .then((tx) => {
        ACTION.SET_BALANCE_LP_TOTAL_STAKED_TRESRAVAX(hexToNumber(tx._hex) / 1e34);
      })
      .catch(() => null);

    await handleContracts
      .contractLpStakingTRESRAVAXWithSigner()
      .totalStaked()
      .then((tx) => {
        ACTION.SET_BALANCE_LP_COMMUNITY_STAKED_TRESRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18));
      })
      .catch(() => null);

    await handleContracts
      .contractLpStakingSMRTRAVAXWithSigner()
      .stakedBalanceOf(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_LP_STAKED_SMRTRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18)))
      .catch(() => null);

    await handleContracts
      .contractLpStakingSMRTRAVAXWithSigner()
      .portion(user?.wallet_id)
      .then((tx) => ACTION.SET_BALANCE_LP_TOTAL_STAKED_SMRTRAVAX(hexToNumber(tx._hex) / 1e34))
      .catch(() => null);

    await handleContracts
      .contractLpStakingSMRTRAVAXWithSigner()
      .totalStaked()
      .then((tx) => {
        ACTION.SET_BALANCE_LP_COMMUNITY_STAKED_SMRTRAVAX(hexToNumber(tx._hex) / Math.pow(10, 18));
      })
      .catch(() => null);
  };

  const stake = async (amount, isTRESR = true) => {
    await handleRewards.depositMasterChef(isTRESR ? 1 : 0, amount);

    // const isApprove = await approveLP(amount, isTRESR);
    // if (!isApprove) return null;

    if (isTRESR) {
      await handleContracts
        .contractLpStakingTRESRAVAXWithSigner()
        .deposit(parseEther(amount?.toString())?.toString())
        .then(async (tx) => {
          new AirdropApi().logger({
            wallet_id: user?.wallet_id,
            type: "PENDING",
            action: "stakeTresrAvaxLP",
            description: "stakeTresrAvaxLP",
            tx: JSON.stringify(tx),
          });

          await tx.wait();
          ACTION.SET_TRANSANCTION_HASH(tx?.hash);
          await balanceOfStakedLp();
          await balanceOfLp();
          await handleRewards.getJlpTresrBonusReward();

          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, STAKE_TRESR_LP_ALERT(true, amount));

          return true;
        })
        .catch(() => {
          ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, STAKE_TRESR_LP_ALERT(false, amount));
          return null;
        });
    } else {
      await handleContracts
        .contractLpStakingSMRTRAVAXWithSigner()
        .deposit(parseEther(amount?.toString())?.toString())
        .then(async (tx) => {
          new AirdropApi().logger({
            wallet_id: user?.wallet_id,
            type: "PENDING",
            action: "stakeSmrtrAvaxLP",
            description: "stakeSmrtrAvaxLP",
            tx: JSON.stringify(tx),
          });

          await tx.wait();
          ACTION.SET_TRANSANCTION_HASH(tx?.hash);
          await balanceOfStakedLp();
          await balanceOfLp();
          await handleRewards.getJlpSmrtBonusReward();

          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, STAKE_SMRTR_LP_ALERT(true, amount));

          return true;
        })
        .catch(() => {
          ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, STAKE_SMRTR_LP_ALERT(false, amount));
          return null;
        });
    }
  };

  const unstake = async (amount, isTRESR = true) => {
    await handleRewards.withdrawMasterChef(isTRESR ? 1 : 0, amount);

    const valueToUnstake = parseEther(amount?.toString())?.toString();

    if (isTRESR) {
      return handleContracts
        .contractLpStakingTRESRAVAXWithSigner()
        .withdraw(valueToUnstake)
        .then(async (tx) => {
          new AirdropApi().logger({
            wallet_id: user?.wallet_id,
            type: "PENDING",
            action: "unstakeTresrAvaxLP",
            description: "unstakeTresrAvaxLP",
            tx: JSON.stringify(tx),
          });

          await tx.wait();
          ACTION.SET_TRANSANCTION_HASH(tx?.hash);
          await balanceOfStakedLp();
          await balanceOfLp();
          await handleRewards.getJlpTresrBonusReward();

          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, UNSTAKE_TRESR_LP_ALERT(true, amount));
        })
        .catch(() => {
          ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, UNSTAKE_TRESR_LP_ALERT(false, amount));
          return null;
        });
    } else {
      return handleContracts
        .contractLpStakingSMRTRAVAXWithSigner()
        .withdraw(valueToUnstake)
        .then(async (tx) => {
          new AirdropApi().logger({
            wallet_id: user?.wallet_id,
            type: "PENDING",
            action: "unstakeSmrtrAvaxLP",
            description: "unstakeSmrtrAvaxLP",
            tx: JSON.stringify(tx),
          });

          await tx.wait();
          ACTION.SET_TRANSANCTION_HASH(tx?.hash);
          await balanceOfStakedLp();
          await balanceOfLp();
          await handleRewards.getJlpSmrtBonusReward();

          ACTION.SET_ALERT(true, ALERT_STATUS_SUCCESS, UNSTAKE_SMRTR_LP_ALERT(true, amount));
        })
        .catch(() => {
          ACTION.SET_ALERT(true, ALERT_STATUS_FAILURE, UNSTAKE_SMRTR_LP_ALERT(false, amount));
          return null;
        });
    }
  };

  return {
    approveLP,
    balanceOfLp,
    balanceOfStakedLp,
    stake,
    unstake,
  };
}
