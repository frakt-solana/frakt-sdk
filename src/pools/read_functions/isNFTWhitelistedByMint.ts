import { Dictionary } from 'lodash';

import { UserNFT } from '../types';

export const isNFTWhitelistedByMint = (
  nft: UserNFT,
  whitelistedMintsDictionary: Dictionary<boolean>,
): string | null => {
  const { mint } = nft;

  return whitelistedMintsDictionary[mint] ? mint : null;
};
