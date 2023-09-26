import React from "react";
import { ReactComponent as Collection } from "../../assets/create/icon-import-layers.svg";
import { ReactComponent as MintIcon } from "../../assets/create/icon-mint-collection.svg";
import { ReactComponent as Resume } from "../../assets/create/arrow-master.svg";

const cards = [
  {
    title: "Create Collection",
    description: "Import arts into layers",
    icon: <Collection />,
    url: "/create/collection",
  },
  {
    title: "Resume Session",
    description: "Login with google to resume saved session",
    icon: <Collection />,
    subIcon: <Resume />,
    url: "/create/session",
  },
  {
    title: "Mint Collection",
    description: `The zip file should contain "metadata" and "images" folders`,
    icon: <MintIcon />,
    url: "/mint/collection",
  },
];
export default cards;
