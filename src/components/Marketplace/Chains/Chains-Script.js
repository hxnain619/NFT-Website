import polygonIcon from "../../../assets/icon-polygon.svg";
import avalancheIcon from "../../../assets/icon-avalanche.svg";
import ethereumIcon from "../../../assets/icon-ethereum.svg";
import allChains from "../../../assets/all-chains.svg";

const chains = [
  {
    name: "All Chains",
    icon: allChains,
    color: "#009987",
    border: "#009987",
    bg: "#FFFFFF",
    isComingSoon: false,
  },
  {
    name: "Polygon",
    label: "POLYGON",
    icon: polygonIcon,
    color: "#8850E6",
    border: "transparent",
    bg: "#DFC6FF",
    isComingSoon: false,
  },
  {
    name: "Avalanche",
    label: "AVALANCHE",
    icon: avalancheIcon,
    color: "#FFFFFF",
    border: "transparent",
    bg: "#E84141CC",
    isComingSoon: false,
  },
  {
    name: "Ethereum",
    label: "ETHEREUM",
    icon: ethereumIcon,
    color: "#4A67FE",
    border: "transparent",
    bg: "#BBC5FF",
    isComingSoon: false,
  },
];
export default chains;
