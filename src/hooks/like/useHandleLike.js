import LikeApi from "../../api/LikeApi";

export default function useHandleLike() {
  const getCountByTokens = (tokenList) => {
    return new LikeApi()
      .getCountByTokens({ tokenList })
      .then((res) => (res?.status ? res?.data : null))
      .catch(() => null);
  };

  const getCountByToken = (contractAddress, tokenID) => {
    return new LikeApi()
      .getCountByToken({ contractAddress, tokenID })
      .then((res) => (res?.status ? res?.data : null))
      .catch(() => null);
  };

  const set = (contractAddress, tokenID) => {
    return new LikeApi()
      .set({ contractAddress, tokenID })
      .then((res) => (res?.status ? res?.data : null))
      .catch(() => null);
  };

  const getAll = () => {
    return new LikeApi()
      .getAll()
      .then((res) => (res?.status ? res?.data : null))
      .catch(() => null);
  };

  return {
    set,
    getCountByToken,
    getCountByTokens,
    getAll,
  };
}
