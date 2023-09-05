import { useEffect, useState } from "react";
import AirdropApi from "../api/AirdropApi";

export default function useTier(level) {
  const [currentTier, setCurrentTier] = useState(null);

  async function loadTier(level) {
    const tierInfo = await new AirdropApi().availableNft(level);
    setCurrentTier(tierInfo);
  }

  useEffect(() => {
    if (level) loadTier(level);
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  return { currentTier };
}
