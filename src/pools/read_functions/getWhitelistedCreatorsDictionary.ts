import { Dictionary } from 'lodash';

import { PoolWhitelistType } from '../types';

export const getWhitelistedCreatorsDictionary = (pool): Dictionary<boolean> =>
  Object.fromEntries(
    pool.poolWhitelist
      .filter(({ whitelistType }) => whitelistType === PoolWhitelistType.CREATOR_WHITELIST)
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true]),
  );
