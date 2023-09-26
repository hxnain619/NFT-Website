import React from "react";
import { ReactComponent as Art } from "../../assets/create/art-icon.svg";
import { ReactComponent as Collection } from "../../assets/create/icon-import-layers.svg";
import { ReactComponent as Video } from "../../assets/create/video-icon.svg";
// import { ReactComponent as Doubletake } from "../../assets/create/bereal-icon.svg";

const cards = [
  // {
  //   title: "AI",
  //   description: "Create Digital art with AI",
  //   icon: <Ai />,
  //   url: "/mint/ai",
  //   comingSoon: "",
  // },
  {
    title: "Digital Art",
    description: "Upload an image and mint",
    icon: <Art />,
    url: "/mint/1of1",
    comingSoon: "",
  },
  {
    title: "Video",
    description: "Upload a video and mint",
    icon: <Video />,
    url: "/mint/video",
    comingSoon: "",
  },
  // {
  //   title: "Proof Of Sesh",
  //   description: "Scan your stick for proof",
  //   icon: <Sesh />,
  //   url: "/mint/sesh",
  //   comingSoon: "",
  // },
  // {
  //   title: "Tweets",
  //   description: "Mint your favorite tweets on chain",
  //   icon: <Tweets />,
  //   url: "/mint/tweet",
  //   comingSoon: false,
  // },
  {
    title: "Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    url: "/collection",
    comingSoon: "",
  },
  // {
  //   title: "Import",
  //   description: "Import collection from the contract",
  //   icon: <Collection />,
  //   url: "/mint/import-collection",
  //   comingSoon: "",
  // },
  // {
  //   title: "Photo",
  //   description: "Take a photo and mint",
  //   icon: <Photo />,
  //   url: "/mint/camera",
  //   comingSoon: "",
  // },

  // {
  //   title: "Proof Of Vibes",
  //   description: "Mint your favorite moments on chain.",
  //   icon: <Vibes />,
  //   url: "/mint/vibe",
  //   comingSoon: "",
  // },

  // {
  //   title: "Video",
  //   description: "Mint your favorite videos on chain",
  //   icon: <Video />,
  //   url: "/mint/Video File",
  //   comingSoon: "",
  // },
  // {
  //   title: "Audio",
  //   description: "Mint your songs/audios on chain",
  //   icon: <Audio />,
  //   url: "/mint/Audio File",
  //   comingSoon: "",
  // },
  // {
  //   title: "Shorts",
  //   description: "Take short video and mint",
  //   icon: <Shorts />,
  //   url: "/mint/video",
  //   comingSoon: "",
  // },
  // {
  //   title: "Doubletake",
  //   description: "Take a photo and selfie and mint",
  //   icon: <Doubletake />,
  //   url: "/mint/doubletake",
  //   comingSoon: "",
  // },
  // {
  //   title: "IPFS",
  //   description: "Mint your NFTs using IPFS link",
  //   icon: <Ipfs />,
  //   url: "/mint/ipfs",
  //   comingSoon: "",
  // },
];
export default cards;
