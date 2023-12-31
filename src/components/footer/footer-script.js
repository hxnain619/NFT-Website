import algorandIcon from "../../assets/footer-icon-algorand.svg";
import pinataIcon from "../../assets/footer-icon-pinata.svg";
import celoIcon from "../../assets/footer-icon-celo.svg";
import polygonIcon from "../../assets/footer-icon-polygon.svg";
import avalancheIcon from "../../assets/footer-icon-avalanche.svg";
import nearIcon from "../../assets/footer-icon-near.svg";
import auroraIcon from "../../assets/footer-icon-aurora.svg";
// import twitterIcon from "../../assets/icon-twitter.svg";
// import instagramIcon from "../../assets/ig-logo.svg";
// import discordIcon from "../../assets/icon-discord.svg";
// import linkedInIcon from "../../assets/icon-linkedin.svg";
// import youTubeIcon from "../../assets/icon-youtube.svg";
import arbitrumIcon from "../../assets/arbitrum.svg";
import telegram from "../../assets/telegram.svg";
import links from "../../assets/icon-links.svg";

import twitterIcon from "../../assets/images/icon-twitter.svg";
import instagramIcon from "../../assets/images/icon-instagram.svg";
import discordIcon from "../../assets/images/icon-discord.svg";
import youTubeIcon from "../../assets/images/icon-youtube.svg";
import facebookIcon from "../../assets/images/icon-facebook.svg";

export const orgs = [
  {
    name: "Pinata",
    icon: pinataIcon,
    link: "https://www.pinata.cloud/",
  },
  {
    name: "Algorand",
    icon: algorandIcon,
    link: "https://www.algorand.com/",
  },
  {
    name: "Celo",
    icon: celoIcon,
    link: "https://celo.org/",
  },
  {
    name: "Polygon",
    icon: polygonIcon,
    link: "https://polygon.technology/",
  },
  {
    name: "Avalanche",
    icon: avalancheIcon,
    link: "https://www.avax.network/",
  },
  {
    name: "Near",
    icon: nearIcon,
    link: "https://near.org/",
  },
  {
    name: "Aurora",
    icon: auroraIcon,
    link: "https://aurora.dev/",
  },
  {
    name: "Arbtrum",
    icon: arbitrumIcon,
    link: "https://arbitrum.io/",
  },
];
export const footerLinks = [
  {
    id: "1",
    title: "DeFi Game",
    content: [
      { name: "Mint Founder's Key", link: "/create", id: "2" },
      { name: "Rewards Dashboard", link: "/marketplace", id: "3" },
    ],
  },
  {
    id: "2",
    title: "E-Commerce",
    content: [
      {
        name: "Get To Know",
        link: "https://twitter.com/genadrop",
        id: "1",
      },
      {
        name: "Create Product",
        link: "https://t.me/+4BDhz2QLaa05NzEx",
        id: "2",
      },
      {
        name: "Shop",
        link: "https://www.genadrop.com/docs",
        id: "3",
      },
      {
        name: "View Profile",
        link: "https://linktr.ee/MinorityProgrammers",
        id: "4",
      },
    ],
  },
];

export const socialLinks = [
  // {
  //   name: "Linktree",
  //   icon: links,
  //   link: "/links",
  // },
  {
    name: "Youtube",
    icon: youTubeIcon,
    link: "https://youtube.com/c/minorityprogrammers",
  },
  {
    name: "Facebook",
    icon: facebookIcon,
    link: "https://facebook.com/genadrop",
  },
  {
    name: "Twitter",
    icon: twitterIcon,
    link: "https://twitter.com/genadrop",
  },
  // {
  //   name: "Telegram",
  //   icon: telegram,
  //   link: "https://t.me/+4BDhz2QLaa05NzEx",
  // },
  // {
  //   name: "Linkedin",
  //   icon: linkedInIcon,
  //   link: "https://linkedin.com/company/genadrop",
  // },
  {
    name: "Instagram",
    icon: instagramIcon,
    link: "https://www.instagram.com/genadrop",
  },
  {
    name: "Discord",
    icon: discordIcon,
    link: "https://discord.gg/4vdtmQqz6d",
  },
];
