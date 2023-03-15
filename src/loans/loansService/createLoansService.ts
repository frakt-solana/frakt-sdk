import { createFetchBulkSuggestion, createFetchWalletNfts } from './requests';
import { createProposeLoan, createProposeLoans } from './transactions';
import { FetchBulkSuggestion, FetchWalletNfts, ProposeLoan, ProposeLoans } from './types';
import {web3} from "@project-serum/anchor";

type CreateLoansService = (props: { apiDomain: string; programPublicKey: string; adminPublicKey: string; }) => {
  fetchWalletNfts: FetchWalletNfts;
  fetchBulkSuggestion: FetchBulkSuggestion;
  proposeLoans: ProposeLoans;
  proposeLoan: ProposeLoan;
};
export const createLoansService: CreateLoansService = ({ apiDomain, programPublicKey, adminPublicKey,}) => {
  return {
    fetchWalletNfts: createFetchWalletNfts(apiDomain),
    fetchBulkSuggestion: createFetchBulkSuggestion(apiDomain),
    proposeLoans: createProposeLoans({ programPublicKey, adminPublicKey }),
    proposeLoan: createProposeLoan({ programPublicKey, adminPublicKey }),
  };
};
