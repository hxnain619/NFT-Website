import useHandleContracts from "./useHandleContracts";
import { Context } from "../../store";
import { useContext } from "react";
import useHandleNFT from "./useHandleNFT";
import useHandleLpStaking from "./useHandleLpStaking";

export default function useGetTokenPrice() {
  const [{ user }] = useContext(Context);

  const handleNFT = useHandleNFT();
  const handleContracts = useHandleContracts();
  const handleLpStaking = useHandleLpStaking();

  const getSMRTR = async () => {
    console.log(`[useFaucet.js::getSMTR]`);
    return handleContracts
      .contractSmarterCoinWithSigner()
      .faucet(user?.wallet_id)
      .then(async (tx) => {
        await tx.wait();
        await handleNFT.balanceOfSMRTR(user?.wallet_id);
      });
  };

  const getTRESR = async () => {
    console.log(`[useFaucet.js::getTRESR]`);

    return handleContracts
      .contractTresrCoinWithSigner()
      .faucet(user?.wallet_id)
      .then(async (tx) => {
        await tx.wait();
        await handleNFT.balanceOfTRESR(user?.wallet_id);
      });
  };

  const getSMRTRLP = async () => {
    console.log(`[useFaucet.js::getSMRTRLP]`);

    return handleContracts
      .contractLpCoinSMRTRAVAXWithSigner()
      .faucet(user?.wallet_id)
      .then(async (tx) => {
        await tx.wait();
        await handleLpStaking.balanceOfLp(user?.wallet_id);
      });
  };

  const getTRESRLP = async () => {
    console.log(`[useFaucet.js::getTRESRLP]`);

    return handleContracts
      .contractLpCoinTRESRAVAXWithSigner()
      .faucet(user?.wallet_id)
      .then(async (tx) => {
        await tx.wait();
        await handleLpStaking.balanceOfLp(user?.wallet_id);
      });
  };

  return {
    getSMRTR,
    getTRESR,
    getSMRTRLP,
    getTRESRLP,
  };
}
