import { Dictionary } from 'lodash';

import { UserNFT } from '../../common/types';
import isNFTWhitelistedByMint from "./isNFTWhitelistedByMint";
import isNFTWhitelistedByCreator from "./isNFTWhitelistedByCreator";


export const isNFTWhitelisted = (
  nft: UserNFT,
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): boolean => (
  (
    !!isNFTWhitelistedByMint(nft, whitelistedMintsDictionary) ||
    !!isNFTWhitelistedByCreator(nft, whitelistedCreatorsDictionary)
  ) && !nft?.metadata?.name?.includes('SSBxSolPunk')
);
