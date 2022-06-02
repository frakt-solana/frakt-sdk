import { Dictionary } from 'lodash';
import { PoolWhitelistType } from '../../common/types';

export const getWhitelistedMintsDictionary = (pool): Dictionary<boolean> =>
  Object.fromEntries(
    pool.poolWhitelist
      .filter(({ whitelistType }) => whitelistType === PoolWhitelistType.SINGLE_NFT_WHITELIST)
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true]),
  );
