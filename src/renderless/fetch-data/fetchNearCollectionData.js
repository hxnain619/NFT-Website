import { gql } from "@apollo/client";
import { GET_NEAR_COLLECTIONS } from "../../graphql/querries/getCollections";
import { getCollectionNearNft, getNearCollectionTransactions } from "../../utils";

export const getCollectionNft = async (nftId) => {
  const { data, error } = await nearCollectionClient
    .query(
      gql`
        query myQuery {
          Nfts_by_pk(id: "${nftId}") {
            category
            chain
            collection
            createdAtTimestamp
            id
            isListed
            isSold
            isSoulBound
            owner
            price
            tokenIPFSPath
            tokenId
            Collection {
              name
              creator
              id
            }
          }
        }
      `
    )
    .toPromise();
  if (error) return [];
  const result = await getCollectionNearNft(data?.Nfts_by_pk);
  return result;
};

export const getCollectionTransactions = async () => {
  const { data, error } = await nearCollectionClient
    .query(
      gql`
        query MyQuery {
          Transactions(where: { Nft: { Collection: { id: { _eq: "agbado.dev-1677462632216-22981353323896" } } } }) {
            from
            id
            price
            to
            txDate
            txId
            type
          }
        }
      `
    )
    .toPromise();
  if (error) return [];
  const result = await getNearCollectionTransactions(data?.Transactions);
  return result;
};
