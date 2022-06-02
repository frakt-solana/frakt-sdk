import { Dictionary } from 'lodash';

import { UserNFT } from '../../common/types';

export const isNFTWhitelistedByCreator = (nft: UserNFT, whitelistedCreatorsDictionary: Dictionary<boolean>): string | null => {
  const { metadata } = nft;

  const nftCreatorAddresses =
    metadata?.properties?.creators?.filter(({ verified }) => !!verified)?.map(({ address }) => address) || [];
  const whitelistedCreatorsAddresses = Object.keys(whitelistedCreatorsDictionary);
  const whitelistedCreator = whitelistedCreatorsAddresses.find((whitelistedCreatorAddress) =>
    nftCreatorAddresses.includes(whitelistedCreatorAddress),
  );

  return whitelistedCreator || null;
};
