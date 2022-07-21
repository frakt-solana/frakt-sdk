import { Dictionary } from 'lodash';

import { UserNFT } from '../types';
import { isNFTWhitelisted } from './isNFTWhitelisted';

export const filterWhitelistedNFTs = (
  nfts: UserNFT[],
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): UserNFT[] => nfts.filter((nft) => isNFTWhitelisted(nft, whitelistedMintsDictionary, whitelistedCreatorsDictionary));
