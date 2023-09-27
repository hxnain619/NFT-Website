import polygonIcon from "../../../assets/icon-polygon.svg";
import avalancheIcon from "../../../assets/icon-avalanche.svg";
import ethereumIcon from "../../../assets/icon-ethereum.svg";
import allChains from "../../../assets/all-chains.svg";

const chains = [
  {
    name: "All Chains",
    label: "ALLCHAIN",
    icon: allChains,
    color: "#ECF1F9",
    border: "#2F88FF",
    bg: "#93A3F814",
    isComingSoon: false,
    isChain: false,
  },
  {
    name: "Polygon",
    label: "POLYGON",
    icon: polygonIcon,
    color: "#8850E6",
    border: "transparent",
    bg: "#DFC6FF",
    isComingSoon: false,
    isChain: true,
  },
  {
    name: "Avalanche",
    label: "AVALANCHE",
    icon: avalancheIcon,
    color: "#FFFFFF",
    border: "transparent",
    bg: "#E84141CC",
    isComingSoon: false,
    isChain: true,
  },
  {
    name: "Ethereum",
    label: "ETHEREUM",
    icon: ethereumIcon,
    color: "#4A67FE",
    border: "transparent",
    bg: "#BBC5FF",
    isComingSoon: false,
    isChain: true,
  },
];
export default chains;
