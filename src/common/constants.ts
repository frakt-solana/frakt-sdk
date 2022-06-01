import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { WSOL } from '@raydium-io/raydium-sdk';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

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

export const ORACLE_URL_BASE = 'https://nft-price-aggregator.herokuapp.com';

export const BLOCKED_POOLS_IDS = ['DqMPkcRT22dPTTsj2rxhCNxg44D93NXiSBWiACAAXd2Q'];
