import { mintSingleToChain, mintToChain } from "../../../utils/arc_ipfs";

export const handleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader } = args;
  if (!account) {
    return dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "polygon" || chain.toLowerCase() === "avalanche") {
      url = await mintToChain({ ...args }, chain);
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }
    dispatch(setLoader(""));
    return url;
  } catch (error) {
    console.error("error: ==========>", error);
    dispatch(setLoader(""));
    return {
      message: "Minting failed. This might be due to poor or no internet connection",
    };
  }
};

export const handleSingleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader } = args;
  console.log(args);

  if (!account) {
    return dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "polygon" || chain.toLowerCase() === "avalanche") {
      url = await mintSingleToChain({ ...args }, chain);
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }
    dispatch(setLoader(""));
    return url;
  } catch (error) {
    console.error("error: ==========>", error);
    dispatch(setLoader(""));
    return {
      message: "Minting failed. This might be due to poor or no internet connection",
    };
  }
};

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve({ name: file.name, url: fr.result });
    };
    fr.readAsDataURL(file);
  });
}

export function getFileFromBase64(string64, fileName) {
  const type = string64.split(",")[0]?.replace(";base64", "")?.replace("data:", "");

  const trimmedString = string64.split(",")[1];
  const imageContent = atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);
  for (let n = 0; n < imageContent.length; n += 1) {
    view[n] = imageContent.charCodeAt(n);
  }
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}
