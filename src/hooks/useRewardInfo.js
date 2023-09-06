import { useEffect, useState } from "react";
import rewardImage from "../assets/images/reward.jpg";

const useRewardInfo = (rewardId = "") => {
  const [rewardInfo, setRewardInfo] = useState(null);

  useEffect(() => {
    const rewardHardcode = {
      imageUrl: rewardImage,
      title: "Nodes Discount",
      description:
        "The Fair Launch Foundation is a collective composed of lead developers from both Google and Amazon, a Harvard professor, industry-leading marketing veterans, a game architect, and a Y-Combinator alum. To ensure the safety of our team and the impartiality of our project, our team and advisor group have voted to remain anonymous to the public. However, our project founder has privately verified their full identity with RugDoc, who rated SmartCoin, our inaugural project, as Low Risk.",
      likeCount: 500,
    };

    setRewardInfo(rewardHardcode);
  }, [rewardId]);

  return {
    rewardInfo,
  };
};

export default useRewardInfo;
