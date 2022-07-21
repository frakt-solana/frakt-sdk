import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { Liquidity, Percent, Spl, SPL_ACCOUNT_LAYOUT, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { createFakeWallet } from '../common';
import {
  AccountInfoData,
  AccountInfoParsed,
  GetInputAmount,
  GetOutputAmount,
  GetTokenAccount,
  ParseTokenAccount,
  UserNFT,
} from './types';
import multiRewardStakingIdl from './idl/multi_reward_staking.json';

export const getInputAmount = ({
  poolKeys,
  poolInfo,
  receiveToken,
  receiveAmount,
  payToken,
  slippage = new Percent(1, 100),
}: GetInputAmount): {
  amountIn: string;
  maxAmountIn: string;
  priceImpact: string;
} => {
  try {
    const amountOut = new TokenAmount(
      new Token(receiveToken.address, receiveToken.decimals, receiveToken.symbol, receiveToken.name),
      receiveAmount,
      false,
    );

    const { amountIn, maxAmountIn, priceImpact } = Liquidity.computeAmountIn({
      poolKeys,
      poolInfo,
      amountOut,
      currencyIn: payToken,
      slippage,
    });

    return {
      amountIn: amountIn.toSignificant(),
      maxAmountIn: maxAmountIn.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    console.error(err);
  }

  return {
    amountIn: '',
    maxAmountIn: '',
    priceImpact: '',
  };
};

export const getOutputAmount = ({
  poolKeys,
  poolInfo,
  payToken,
  payAmount,
  receiveToken,
  slippage = new Percent(1, 100),
}: GetOutputAmount): {
  amountOut: string;
  minAmountOut: string;
  priceImpact: string;
} => {
  try {
    const amountIn = new TokenAmount(
      new Token(payToken.address, payToken.decimals, payToken.symbol, payToken.name),
      payAmount,
      false,
    );

    const { amountOut, minAmountOut, priceImpact } = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut: receiveToken,
      slippage,
    });

    return {
      amountOut: amountOut.toSignificant(),
      minAmountOut: minAmountOut.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    console.error(err);
  }

  return {
    amountOut: '',
    minAmountOut: '',
    priceImpact: '',
  };
};

export const decodeSplTokenAccountData = (tokenAccountDataEncoded: Buffer): AccountInfoData =>
  SPL_ACCOUNT_LAYOUT.decode(tokenAccountDataEncoded);

export const parseTokenAccount: ParseTokenAccount = ({ tokenAccountPubkey, tokenAccountEncoded }) =>
  tokenAccountEncoded
    ? {
        pubkey: tokenAccountPubkey,
        accountInfo: decodeSplTokenAccountData(tokenAccountEncoded.data),
      }
    : null;

export const getTokenAccount = async ({
  tokenMint,
  owner,
  connection,
}: GetTokenAccount): Promise<AccountInfoParsed | null> => {
  const tokenAccountPubkey = await Spl.getAssociatedTokenAccount({
    mint: tokenMint,
    owner,
  });

  const tokenAccountEncoded = await connection.getAccountInfo(tokenAccountPubkey);

  return parseTokenAccount({ tokenAccountPubkey, tokenAccountEncoded });
};

export const getTokenAccountBalance = (lpTokenAccountInfo: AccountInfoParsed, lpDecimals: number): number =>
  lpTokenAccountInfo?.accountInfo?.amount.toNumber() / 10 ** lpDecimals || 0;

export const shortenAddress = (address: string, chars = 4): string =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`;

export const getNftCreators = (nft: UserNFT): string[] =>
  nft?.metadata?.properties?.creators?.filter(({ verified }) => verified)?.map(({ address }) => address) || [];

export const returnAnchorMultiRewardStaking = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
): Promise<Program> => {
  return new Program(
    multiRewardStakingIdl as any,
    programId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );
};

export const deriveMetadataPubkeyFromMint = async (nftMint: web3.PublicKey): Promise<web3.PublicKey> => {
  let metadata_program = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

  const encoder = new TextEncoder();
  const [metadataPubkey] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('metadata'), metadata_program.toBuffer(), nftMint.toBuffer()],
    metadata_program,
  );

  return metadataPubkey;
};
