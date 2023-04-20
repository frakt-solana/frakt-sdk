const axios = require('axios');
axios;
import { BorrowNft, BulkSuggestion, FetchBulkSuggestion, FetchWalletNfts } from './types';

type CreateFetchWalletNfts = (apiDomain: string) => FetchWalletNfts;
export const createFetchWalletNfts: CreateFetchWalletNfts =
  (apiDomain) =>
  async ({ walletPublicKey, limit = 1000, offset = 0 }) => {
    const { data } = await axios.get(
      `https://${apiDomain}/nft/meta/${walletPublicKey?.toBase58()}?limit=${limit}&offset=${offset}`,
    );
    return data;
  };

type CreateFetchBulkSuggestion = (apiDomain: string) => FetchBulkSuggestion;
export const createFetchBulkSuggestion: CreateFetchBulkSuggestion =
  (apiDomain) =>
  async ({ walletPublicKey, totalValue }) => {
    const { data } = await axios.get(
      `https://${apiDomain}/nft/suggest/${walletPublicKey?.toBase58()}?solAmount=${totalValue}`,
    );
    return data;
  };
