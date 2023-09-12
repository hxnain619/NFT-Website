import { createClient } from "urql";
import { isMainNet } from "./chain";

const polygonClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/52649/nftreasure-mumbai/version/latest"
    : "https://api.studio.thegraph.com/query/52649/nftreasure-mumbai/version/latest",
  requestPolicy: "cache-first",
});

const avalancheClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/52649/nftreasure/version/latest"
    : "https://api.studio.thegraph.com/query/52649/nftreasure/version/latest",
  requestPolicy: "cache-first",
});

const ethClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/52649/nftreasure-goerli/version/latest"
    : "https://api.studio.thegraph.com/query/52649/nftreasure-goerli/version/latest",
  requestPolicy: "cache-first",
});

export { polygonClient, avalancheClient, ethClient };
