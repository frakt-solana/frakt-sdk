import { CurrencyAmount, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';

import { SOL_TOKEN } from '../../common/constants';

export const getCurrencyAmount = (tokenInfo, amount: BN): CurrencyAmount | TokenAmount => {
  return tokenInfo.address === SOL_TOKEN.address
    ? new CurrencyAmount(SOL_TOKEN, amount)
    : new TokenAmount(new Token(tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name), amount);
};
