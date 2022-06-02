import { Dictionary } from 'lodash';

import { isNFTWhitelisted } from './isNFTWhitelisted';
import { UserNFT } from '../../common/types';

const filterWhitelistedNFTs = (
  nfts: UserNFT[],
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): UserNFT[] => nfts.filter((nft) => isNFTWhitelisted(nft, whitelistedMintsDictionary, whitelistedCreatorsDictionary));

export default filterWhitelistedNFTs;
