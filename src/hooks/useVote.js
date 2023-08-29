import { useEffect, useState } from "react";
import placeholderImg from "../components/VotePage/placeholder.jpg";

const useVote = (filter) => {
  const [, setVoteData] = useState(null);
  const [voteDataToShow, setVoteDataToShow] = useState(null);
  const [singleVoteData, setSingleVoteData] = useState(null);
  const [voteList, setVoteList] = useState(null);

  const voteListContent = [
    {
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      answer: "yes",
      balance: "1.7K TRESR",
    },
    {
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      answer: "yes",
      balance: "1.7K TRESR",
    },
    {
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      answer: "yes",
      balance: "1.7K TRESR",
    },
    {
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      answer: "yes",
      balance: "1.7K TRESR",
    },
  ];

  const voteContent = [
    {
      id: 1,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "active",
    },
    {
      id: 2,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "active",
    },
    {
      id: 3,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "executed",
    },
    {
      id: 4,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "defeated",
    },
    {
      id: 5,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "canceled",
    },
    {
      id: 6,
      avatar: placeholderImg,
      address: "0xeSv9d...8ast",
      description: "Should Founder’s Key ... ?",
      likeCount: 1774,
      dislikeCount: 177,
      status: "active",
    },
  ];

  useEffect(() => {
    setVoteData(voteContent);
    if (filter) {
      if (filter === "all") {
        setVoteDataToShow(voteContent);
      } else {
        setVoteDataToShow(voteContent.filter((item) => item.status === filter));
      }
    }
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSingleVote = (id) => {
    const data = voteContent.find((item) => item.id === id);
    setSingleVoteData(data);
    setVoteList(voteListContent);
  };

  const showMoreVotes = () => {
    setVoteList([...voteList, ...voteListContent]);
  };

  return {
    voteDataToShow,
    singleVoteData,
    getSingleVote,
    voteList,
    showMoreVotes,
  };
};

export default useVote;
