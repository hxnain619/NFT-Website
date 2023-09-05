import { ethers } from "ethers";
import { useContext } from "react";
import { Context } from "../../store";
import { AVALANCHE_TESTNET_PARAMS } from "../../constant/blockchain";
import { hexToNumber, isAvalancheChain } from "../../utils/blockchain";
import useHandleContracts from "./useHandleContracts";

export default function useWalletConnect() {
  const [, ACTION] = useContext(Context);
  const handleContracts = useHandleContracts();

  const switchToAvalancheChain = async () => {
    await window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [AVALANCHE_TESTNET_PARAMS],
      })
      .catch(() => null);
  };

  const balanceOf = async (address) => {
    await handleContracts
      .contractNFKeyWithSigner()
      .balanceOf(address)
      .then((res) => ACTION.SET_TOKENS_COUNT(hexToNumber(res?._hex)))
      .catch(() => null);
  };

  const ethereumListener = async (callback) => {
    try {
      if (window?.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (!isAvalancheChain(chainId.toString(16))) await switchToAvalancheChain();
        await provider.send("eth_requestAccounts", []);

        window.ethereum.on("accountsChanged", callback);
        window.ethereum.on("chainChanged", callback);
      }
    } catch (err) {}
  };

  const connectWallet = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork().catch(() => null);
    if (!network) return;

    if (!isAvalancheChain(network?.chainId?.toString(16))) await switchToAvalancheChain();

    await findWallet(address);
  };

  const findWallet = async (address) => {
    await balanceOf(address);

    await handleContracts
      .contractWhitelistWithSigner()
      .getAddressToWhitelist(address)
      .then((res) =>
        ACTION.SET_WHITELIST_STATUS({
          whitelistAddress: address,
          level: hexToNumber(res?._hex),
        })
      );
  };

  return {
    connectWallet,
    ethereumListener,
  };
}
