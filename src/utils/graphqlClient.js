import { createClient } from "urql";

export const polygonClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/playdrop"
      : "https://api.thegraph.com/subgraphs/name/prometheo/polygon-mainnet",
  requestPolicy: "cache-first",
});
export const avalancheClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/doochain/subgraph-genadrop"
      : "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-avax",
  requestPolicy: "cache-first",
});

// export const avalancheClient = createClient({
//   url:
//     process.env.REACT_APP_ENV_STAGING === "true"
//       ? "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-avatestnet"
//       : "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-avax",
//   requestPolicy: "cache-first",
// });
