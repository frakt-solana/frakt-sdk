import { WSOL } from '@raydium-io/raydium-sdk';
import { TokenInfo } from './types';

export const SOL_TOKEN: TokenInfo = {
  chainId: 101,
  address: WSOL.mint,
  name: 'SOL',
  decimals: 9,
  symbol: 'SOL',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  extensions: {
    coingeckoId: 'solana',
  },
};
