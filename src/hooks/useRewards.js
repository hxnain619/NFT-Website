import { useEffect, useState } from "react";
import rewardImage from "../assets/images/reward.jpg";
import user1 from "../assets/images/user1.png";
import user2 from "../assets/images/user2.png";

const useRewards = (itemsToShow = 4) => {
  const [rewardsData, setRewardsData] = useState(null);
  const [rewardsDataToShow, setRewardsDataToShow] = useState(null);

  useEffect(() => {
    const rewardsHardcode = [
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
      {
        imageUrl: rewardImage,
        title: "Nodes Discount",
        availableCount: 600,
        likeCount: 500,
        userImages: [user1, user2, user1],
      },
    ];

    setRewardsData(rewardsHardcode);
    setRewardsDataToShow(rewardsHardcode.slice(0, itemsToShow));
  }, [itemsToShow]);

  return {
    rewardsDataToShow,
    size: rewardsData ? rewardsData.length : 0,
  };
};

export default useRewards;
