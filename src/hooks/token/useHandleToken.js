import TokenApi from "../../api/TokenApi";
import EventApi from "../../api/EventApi";
import { nowUnix, sleep } from "../../utils";
// TODO: this is not required, should moved to useHandleNFT
export default function useHandleToken() {
  const createToken = (data) => {
    return new TokenApi().createToken(data);
  };
  const _tierDuration = (tier) => {
    return (8 - tier) * 60; // PRODUCTION: this should be a day not 60s
  };

  const computeTier = (nfkey) => {
    let updatedTime = nfkey.tierUpdatedTime;
    for (let i = nfkey.tierTresr; i > 0; i--) {
      if (nowUnix() < updatedTime + _tierDuration(i)) {
        return i;
      }
      updatedTime += _tierDuration(i);
    }
    return 0;
  };

  // TODO: this should be refactored, computeTier, getComputeTier two function
  const getComputeTier = (selectedToken) => {
    const tierTresr = computeTier(selectedToken);
    return [...selectedToken, tierTresr];
  };

  const getTierUpdatedToken = (_token) => {
    console.log(`getTierUpdatedToken start token:`, _token);

    let token = { ..._token };
    let updatedTime = _token.tierUpdatedTime;
    let currentTime = nowUnix();
    console.log("getTierUpdatedToken currentTime", currentTime);
    let i = 0;
    for (i = token.tierTresr; i > 0; i--) {
      if (currentTime < updatedTime + _tierDuration(i)) {
        updatedTime += _tierDuration(i);
        break;
      }
      updatedTime += _tierDuration(i);
    }
    token.tierTresr = i;
    token.tierExpireTime = updatedTime;
    console.log(`getTierUpdatedToken token:`, token);
    return token;
  };

  const getTokenList = (userAddress) => {
    return new TokenApi().getTokenList(userAddress).then((res) =>
      res?.status
        ? res?.data?.data.map((nfkey) => {
            nfkey = getTierUpdatedToken(nfkey);
            return nfkey;
          }) || []
        : []
    );
  };

  const checkToken = (tokenID) => {
    return new TokenApi().checkToken({ tokenID }).then((res) => (res?.status ? getTierUpdatedToken(res?.data) : null));
  };

  const updateUserTokenList = (contractAddress, count = 3) => {
    return new TokenApi()
      .updateUserTokenList({ contractAddress })
      .then((res) => (res?.status ? res?.data : null))
      .catch(() => (count ? updateUserTokenList(contractAddress, count - 1) : null));
  };

  const checkTxEventSingle = async (txHash, eventName) => {
    const res = await new TokenApi().checkTxEvent({ txHash, eventName });
    console.log("res?.data", res?.data);
    if (res?.status) if (res?.data) return true;
  };
  // FIXME: refactor function name and function code
  async function getcheckTxEvent(txHash, eventName) {
    return new Promise(async (resolve, reject) => {
      let temp = undefined,
        count = 0;
      while (temp === undefined) {
        count++;
        if (count > 7) break;
        temp = await checkTxEventSingle(txHash, eventName);
        if (temp === true) break;
        await sleep(1);
      }
      resolve(true);
    });
  }

  const getTokenHistory = (contractAddress, tokenID) => {
    return new EventApi().getTokenHistory(contractAddress, tokenID).then((res) => (res?.status ? res?.data : null));
  };

  return {
    getTierUpdatedToken,
    createToken,
    getTokenList,
    checkToken,
    getTokenHistory,
    updateUserTokenList,
    getcheckTxEvent,
    getComputeTier,
  };
}
