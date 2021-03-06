import { Dictionary } from 'lodash';
import { UserNFT } from '../../common/types';

export const isNFTWhitelistedByMint = (nft: UserNFT, whitelistedMintsDictionary: Dictionary<boolean>): string | null => {
  const { mint } = nft;

  return whitelistedMintsDictionary[mint] ? mint : null;
};
