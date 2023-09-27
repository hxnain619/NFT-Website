/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import moment from "moment";
import { getFormatedPrice } from "../../utils";
import supportedChains from "../../utils/supportedChains";
import { supportsResultCaching } from "@apollo/client/cache/inmemory/entityStore";
import { collection } from "firebase/firestore";
import { filter } from "jszip";

let rates = [];
rates[0] = 10.39;
rates[80001] = 0.562036;
rates[137] = 0.562036;
rates[43113] = 10.39;
rates[43114] = 10.39;

const getRates = async () => {
  for (const chain in supportedChains) {
    const rate = await getFormatedPrice(chain);
    if (rate != -1) rates[chain] = rate;
  }
  setTimeout(getRates, 60000);
};
getRates();

const filterByListed = (collections) => {
  return collections.filter((col) => col.isListed);
  // return collections.filter(({ price, owner }) => !price && owner === account);
};

const filterByNOtListed = (collections) => {
  return collections.filter((col) => !col.isListed);
};

const filterByOnAuchtion = (collections) => {
  return collections.filter(({ isListed }) => isListed);
};

const sortByDateAscending = (col) => {
  const collection = [...col].sort((a, b) => moment(new Date(b.createdAt)).diff(new Date(a.createdAt)));
  return collection;
};

const sortByDateDescending = (col) => {
  const collection = [...col].sort((a, b) => moment(new Date(a.createdAt)).diff(new Date(b.createdAt)));
  return collection;
};

const sortByPriceAscending = (col) => {
  const collection = [...col].sort(
    (a, b) => Number(a.price) * Number(rates[a.chain]) - Number(b.price) * Number(rates[b.chain])
  );
  return collection;
};

const sortByPriceDescending = (col) => {
  const collection = [...col].sort(
    (a, b) => Number(b.price) * Number(rates[b.chain]) - Number(a.price) * Number(rates[a.chain])
  );
  return collection;
};

const sortByNameAscending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
    return -1;
  });
  return collection;
};

const sortByNameDescending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (a.name?.toLowerCase() > b.name?.toLowerCase()) return -1;
    return 1;
  });
  return collection;
};

export const sortBy = ({ value, collections }) => {
  switch (value) {
    case "Newest":
      return sortByDateAscending(collections);

    case "Oldest":
      return sortByDateDescending(collections);

    case "Highest price":
      return sortByPriceDescending(collections);

    case "Lowest price":
      return sortByPriceAscending(collections);

    case "a - z":
      return sortByNameAscending(collections);

    case "z - a":
      return sortByNameDescending(collections);
    default:
      break;
  }
};

export const filterBy = ({ value, collections, account }) => {
  switch (value) {
    case "All":
      return collections;
    case "Listed":
      return filterByListed(collections, account);
    case "Not Listed":
      return filterByNOtListed(collections, account);
    case "on auction":
      return filterByOnAuchtion(collections);
    default:
      break;
  }
};

export const rangeBy = async ({ value, collections }) => {
  const result = await Promise.all(
    collections.map(async (col) => {
      const rate = await getFormatedPrice(supportedChains[col.chain].coinGeckoLabel || supportedChains[col.chain].id);
      const price = Number(rate) * Number(col.price);
      return price >= value.minPrice && price <= value.maxPrice ? col : null;
    })
  );

  return result.filter((res) => res);
};

export const shuffle = (array) => {
  for (let i = 0; i < 100; i += 1) {
    for (let x = array.length - 1; x > 0; x -= 1) {
      const j = Math.floor(Math.random() * (x + 1));
      [array[x], array[j]] = [array[j], array[x]];
    }
  }
  return array;
};

export const getCollectionsByDate = ({ collections, date }) => {
  if (date === 0) return collections;

  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();
  const last30DaysDate = new Date(currentDate.setDate(currentDate.getDate() - date));
  const last30DaysDateTime = last30DaysDate.getTime();

  return collections.filter((nft) => {
    // let newDate;
    // if (c?.createdAt?.seconds) {
    //   newDate = c.createdAt.seconds;
    // } else {
    //   newDate = c.createdAt;
    // }

    const elementDateTime = new Date(nft?.createdAt).getTime();
    if (elementDateTime <= currentDateTime && elementDateTime > last30DaysDateTime) {
      return true;
    }
    return false;
  });
};

export const getCollectionsByChain = ({ collections, chain, mainnet }) => {
  if (chain === "All Chains") {
    return collections;
  }
  const mapChainLabelToId = {};
  const chains = Object.values(supportedChains);
  chains
    .filter((data) => mainnet === data.isMainnet)
    .forEach((chain) => {
      mapChainLabelToId[chain.chain] = chain;
    });
  return collections.filter((col) => col.chain === mapChainLabelToId[chain]?.networkId);
};

export const getCollectionsBySearch = ({ collections, search }) => {
  if (!collections.length) return null;
  const value = search.trim().toLocaleLowerCase();
  return collections.filter(
    (el) =>
      el.name?.toLowerCase().includes(value) ||
      el.description?.toLowerCase().includes(value) ||
      el.owner?.toLowerCase().includes(value) ||
      el.contractAddress?.toLowerCase().includes(value) ||
      el.collection_contract?.toLowerCase().includes(value)
  );
};

export const getFilteredData = ({
  collections,
  activeCategory = "All",
  activeChain = "All Chains",
  activeStatus = null,
  priceFrom = 0,
  priceTo = 100,
  sortby,
}) => {
  let filtered = collections.filter((item) => {
    let categoryCheck = item.properties ? item.properties : item.ipfs_data?.properties;

    categoryCheck = categoryCheck?.filter((property) => {
      return property.trait_type === "Category" && property.value === activeCategory;
    });

    const price = Number(item.price) * Number(rates[item.chain]);

    return (
      (activeChain === "All Chains" ? true : supportedChains[item.chain].chain === activeChain) &&
      (activeCategory === "All" ? true : categoryCheck.length) &&
      (activeStatus === null ? true : item.isListed === activeStatus) &&
      price >= priceFrom &&
      price <= priceTo
    );
  });
  return sortBy({ value: sortby, collections: filtered });

  // if (category === "All" && activeChain === "All Chains") {
  //   return collections;
  // }
  // let singleNFTs = collections.filter((col) => !col.nfts);
  // let filteredCategory = [];
  // if (category !== "All" && activeChain === "All Chains") {
  //   filteredCategory = singleNFTs;
  // } else if (category === "All" && activeChain !== "All Chains") {
  //   return [...singleNFTs.filter((nft) => supportedChains[nft.chain].chain === activeChain)];
  // } else {
  //   filteredCategory = singleNFTs.filter((nft) => supportedChains[nft.chain].chain === activeChain);
  // }
  // singleNFTs = filteredCategory.filter((col) => {
  //   let categoryCheck = col.properties ? col.properties : col.ipfs_data?.properties;

  //   categoryCheck = categoryCheck?.filter((property) => {
  //     return property.trait_type === "Category" && property.value === category;
  //   });
  //   return categoryCheck.length;
  // });
  // return [...singleNFTs];
};

export const getCollectionsByCategory = ({ collections, category, activeChain }) => {
  if (category === "All" && activeChain === "All Chains") {
    return collections;
  }
  let singleNFTs = collections.filter((col) => !col.nfts);
  let filteredCategory = [];
  if (category !== "All" && activeChain === "All Chains") {
    filteredCategory = singleNFTs;
  } else if (category === "All" && activeChain !== "All Chains") {
    return [...singleNFTs.filter((nft) => supportedChains[nft.chain].chain === activeChain)];
  } else {
    filteredCategory = singleNFTs.filter((nft) => supportedChains[nft.chain].chain === activeChain);
  }
  singleNFTs = filteredCategory.filter((col) => {
    let categoryCheck = col.properties ? col.properties : col.ipfs_data?.properties;

    categoryCheck = categoryCheck?.filter((property) => {
      return property.trait_type === "Category" && property.value === category;
    });
    return categoryCheck.length;
  });
  return [...singleNFTs];
};

// audio/mpeg
// Video
