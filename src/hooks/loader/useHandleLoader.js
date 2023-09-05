import { useContext } from "react";
import { Context } from "../../store";

export default function useHandleLoader() {
  const [, ACTION] = useContext(Context);

  const loaderWrapper = async (callback, opacityLevel = 3) => {
    if (!callback) return;

    ACTION.SET_LOADER(true, opacityLevel);
    return callback().finally(() => ACTION.SET_LOADER(false));
  };

  return {
    loaderWrapper,
  };
}
