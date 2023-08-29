import { gql } from "@apollo/client";
import { ethers } from "ethers";

export const GET_GRAPH_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      creator {
        id
      }
      name
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }

        tokenIPFSPath
        transactions {
          id
          txDate
          price
          txId
          to {
            id
          }
          from {
            id
          }
          type
        }
      }
    }
  }
`;

export const GET_SINGLE_GRAPH_COLLECTION = gql`
  query ($id: ID) {
    collection(id: $id) {
      description
      id
      name
      creator {
        id
      }
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isSoulBound
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          from {
            id
          }
          type
          price
          to {
            id
          }
        }
      }
    }
  }
`;

export const GET_GRAPH_COLLECTION = gql`
  query ($id: ID) {
    collection(id: $id) {
      description
      id
      name
      nfts {
        chain
        id
        isSold
        price
        tokenID
        tokenIPFSPath
        owner {
          id
        }
      }
    }
  }
`;

export const GET_USER_NFT = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      nfts {
        chain
        createdAtTimestamp
        id
        isSold
        price
        isSoulBound
        tokenID
        collection {
          id
        }
        tokenIPFSPath
        owner {
          id
          collections {
            name
          }
        }
      }
    }
  }
`;

export const GET_USER_COLLECTIONS = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      collections {
        description
        id
        name
        nfts {
          chain
          category
          createdAtTimestamp
          id
          isSold
          price
          collection {
            name
            id
          }
          tokenID
          owner {
            id
          }
          tokenIPFSPath
          transactions {
            id
            txDate
            txId
            from {
              id
            }
            type
            price
            to {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      isListed
      price
      isSoulBound
      tokenID
      owner {
        id
      }
      collection {
        id
        name
        creator {
          id
        }
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        to {
          id
        }
        from {
          id
        }
        type
        price
      }
    }
  }
`;

export const GET_FEATURED_SINGLE_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

const polygonAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);

const polygonSoulBoundAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env?.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS)
    : ethers.utils.hexlify(process.env?.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS);

const avalancheAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);

const avalancheSoulBoundAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env?.REACT_APP_AVAX_TESTNET_SOULBOUND_ADDRESS)
    : ethers.utils.hexlify(process.env?.REACT_APP_AVAX_MAINNET_SOULBOUND_ADDRESS);

const addressByNetworkandSoulBound = (chainName, isSoulBound) => {
  return isSoulBound
    ? chainName == "Polygon"
      ? polygonSoulBoundAddress
      : chainName === "Avalanche"
      ? avalancheSoulBoundAddress
      : ""
    : chainName === "Polygon"
    ? polygonAddress
    : chainName === "Avalanche"
    ? avalancheAddress
    : "";
};

const limitString = (limit) => {
  return limit ? `first: ${limit}` : "";
};

export const GET_SIGNLE_NFTS = (chainName, limit, isSoulBound) => {
  return `
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, ${limitString(
      limit
    )}, where: { collection_in: ["${addressByNetworkandSoulBound(chainName, isSoulBound)}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
  `;
};
