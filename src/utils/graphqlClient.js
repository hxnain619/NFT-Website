import { createClient } from "urql";
import { isMainNet } from "./chain";

const polygonClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/53114/mp-mumbai/version/latest"
    : "https://api.studio.thegraph.com/query/53114/mp-mumbai/version/latest",
  requestPolicy: "cache-first",
});

const avalancheClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/53114/mp-fuji/version/latest"
    : "https://api.studio.thegraph.com/query/53114/mp-fuji/version/latest",
  requestPolicy: "cache-first",
});

const ethClient = createClient({
  url: isMainNet
    ? "https://api.studio.thegraph.com/query/53114/mp-goerli/version/latest"
    : "https://api.studio.thegraph.com/query/53114/mp-goerli/version/latest",
  requestPolicy: "cache-first",
});

export { polygonClient, avalancheClient, ethClient };
