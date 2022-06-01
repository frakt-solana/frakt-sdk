import anchor from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { AccountLayout, Token as SplToken, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { NodeWallet } from '@metaplex/js';
import BN from 'bn.js';
import { Dictionary, groupBy } from 'lodash';
import {
  CurrencyAmount,
  Liquidity,
  LiquidityPoolInfo,
  LiquidityPoolKeysV4,
  Percent,
  Spl,
  SPL_ACCOUNT_LAYOUT,
  Token,
  TokenAmount,
  WSOL
} from '@raydium-io/raydium-sdk';

import {
  ORACLE_URL_BASE, SOL_TOKEN,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  BLOCKED_POOLS_IDS
} from './constants';
import {
  AccountInfoData,
  AccountInfoParsed,
  AmountInParams,
  AmountOutParams,
  CollectionInfoView,
  GetAllUserTokens,
  GetFeePercent,
  GetNftReturnPeriod,
  GetTokenAccount,
  LoanData,
  LoanView,
  ParseTokenAccount,
  PoolWhitelistType, RaydiumPoolInfoMap,
  UserNFT,
  PoolData,
  FetchPoolDataByMint,
  LoanDataByPoolPublicKey
} from './types';
import getAllProgramAccounts from '../nft_lending/read_functions/getAllProgramAccounts';

//when we only want to view vaults, no need to connect a real wallet.
export const createFakeWallet = () => {
  const leakedKp = Keypair.fromSecretKey(
    Uint8Array.from([
      208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242, 120, 4, 78, 75, 19, 227, 13, 215, 184,
      108, 226, 53, 111, 149, 179, 84, 137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158, 226,
      207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
    ]),
  );
  return new NodeWallet(leakedKp);
};

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): Promise<PublicKey> => (
  (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0]
);

export const getTokenBalance = async (pubkey: PublicKey, connection: Connection) => {
  const balance = await connection.getTokenAccountBalance(pubkey);

  return parseInt(balance.value.amount);
};

export const createUninitializedAccount = (
  payer: PublicKey,
  amount: number,
): { instructions: TransactionInstruction[]; signers: Keypair[]; accountPubkey: PublicKey } => {
  const account = Keypair.generate();

  const instructions = [
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    }),
  ];

  const signers = [account];

  return { accountPubkey: account.publicKey, instructions, signers };
};

export const createTokenAccount = (
  payer: PublicKey,
  accountRentExempt: number,
  mint: PublicKey,
  owner: PublicKey,
): { instructions: TransactionInstruction[]; signers: Keypair[]; accountPubkey: PublicKey } => {
  const {
    instructions: newInstructions,
    signers: newSigners,
    accountPubkey,
  } = createUninitializedAccount(payer, accountRentExempt);

  const initAccountInstruction = SplToken.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, accountPubkey, owner);

  return { accountPubkey, signers: newSigners, instructions: [...newInstructions, initAccountInstruction] };
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey,
): TransactionInstruction[] => {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  return [
    new TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    }),
  ];
};

export const deriveMetadataPubkeyFromMint = async (nftMint: PublicKey): Promise<PublicKey> => {
  let metadata_program = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

  const encoder = new TextEncoder();
  const [metadataPubkey] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('metadata'), metadata_program.toBuffer(), nftMint.toBuffer()],
    metadata_program,
  );

  return metadataPubkey;
};

export const decodeSplTokenAccountData = (tokenAccountDataEncoded: Buffer): AccountInfoData => (
  SPL_ACCOUNT_LAYOUT.decode(tokenAccountDataEncoded)
);

export const parseTokenAccount: ParseTokenAccount = ({ tokenAccountPubkey, tokenAccountEncoded }) => (
  tokenAccountEncoded
    ? {
      publicKey: tokenAccountPubkey,
      accountInfo: decodeSplTokenAccountData(tokenAccountEncoded.data),
    }
    : null
);

export const getTokenAccount = async ({ tokenMint, owner, connection}: GetTokenAccount): Promise<{ pubkey: PublicKey; accountInfo: any; } | null> => {

  const tokenAccountPubkey = await Spl.getAssociatedTokenAccount({
    mint: tokenMint,
    owner,
  });

  const tokenAccountEncoded = await connection.getAccountInfo(tokenAccountPubkey);

  return tokenAccountEncoded
    ? {
      pubkey: tokenAccountPubkey,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(tokenAccountEncoded.data),
    }
    : null;
};

export const getTokenAccountBalance = (lpTokenAccountInfo: AccountInfoParsed, lpDecimals: number): number => (
  lpTokenAccountInfo?.accountInfo?.amount.toNumber() / 10 ** lpDecimals || 0
);

export const getAllUserTokens: GetAllUserTokens = async ({ connection, walletPublicKey }) => {

  const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
    walletPublicKey,
    { programId: TOKEN_PROGRAM_ID },
    'singleGossip',
  );

  const parse = (parsedData) => {
    try {
      return new BN(parsedData.amount, 10, 'le')?.toNumber();
    } catch (error) {
      return -1;
    }
  };

  return (
    tokenAccounts?.map(({ pubkey, account }) => {
      const parsedData = AccountLayout.decode(account.data);

      const amountNum = parse(parsedData);

      return {
        tokenAccountPubkey: pubkey.toBase58(),
        mint: new PublicKey(parsedData.mint).toBase58(),
        owner: new PublicKey(parsedData.owner).toBase58(),
        amount: amountNum,
        amountBN: new BN(parsedData.amount, 10, 'le'),
        delegateOption: !!parsedData.delegateOption,
        delegate: new PublicKey(parsedData.delegate).toBase58(),
        state: parsedData.state,
        isNativeOption: !!parsedData.isNativeOption,
        isNative: new BN(parsedData.isNative, 10, 'le').toNumber(),
        delegatedAmount: new BN(
          parsedData.delegatedAmount,
          10,
          'le',
        ).toNumber(),
        closeAuthorityOption: !!parsedData.closeAuthorityOption,
        closeAuthority: new PublicKey(parsedData.closeAuthority).toBase58(),
      };
    }) || []
  );
};

export const shortenAddress = (address: string, chars = 4): string => (
  `${address.slice(0, chars)}...${address.slice(-chars)}`
);

export const getCurrencyAmount = (tokenInfo, amount: BN): CurrencyAmount | TokenAmount => {
  return tokenInfo.address === SOL_TOKEN.address
    ? new CurrencyAmount(SOL_TOKEN, amount)
    : new TokenAmount(
      new Token(
        tokenInfo.address,
        tokenInfo.decimals,
        tokenInfo.symbol,
        tokenInfo.name,
      ),
      amount,
    );
};

export const getLoanCollectionInfo = (loanData: LoanData, collectionInfoPublicKey: string): CollectionInfoView | undefined => (
  loanData.collectionsInfo?.find(
    ({ collectionInfoPubkey }) =>
      collectionInfoPubkey === collectionInfoPublicKey,
  )
);

export const getNftCreators = (nft: UserNFT): string[] => (
  nft?.metadata?.properties?.creators?.filter(({ verified }) => verified)?.map(({ address }) => address) || []
);

export const getFeePercent: GetFeePercent = ({ loanData, nft }) => {
  const PERCENT_PRECISION = 100;

  const nftCreators = getNftCreators(nft);

  const royaltyFeeRaw =
    loanData?.collectionsInfo?.find(({ creator }) =>
      nftCreators.includes(creator),
    )?.royaltyFeeTime || 0;

  const rewardInterestRateRaw =
    loanData?.liquidityPool?.rewardInterestRateTime || 0;

  const feeInterestRateRaw = loanData?.liquidityPool?.feeInterestRateTime || 0;

  const feesPercent =
    (royaltyFeeRaw + rewardInterestRateRaw + feeInterestRateRaw) /
    (100 * PERCENT_PRECISION);

  return feesPercent || 0;
};

export const getNftReturnPeriod: GetNftReturnPeriod = ({ loanData, nft }) => {
  const nftCreators = getNftCreators(nft);

  return loanData?.collectionsInfo?.find(({creator}) => nftCreators.includes(creator))?.expirationTime || 0;
};

export const getNftMarketLowerPriceByCreator = async (creatorAddress: string): Promise<number | null> => {
  try {
    const res = await fetch(`${ORACLE_URL_BASE}/creator/${creatorAddress}`);
    const data = await res.json();

    return data?.floor_price || null;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const getNftMarketLowerPricesByCreators = async (creatorsAddresses = []) => {
  try {
    const res = await fetch(`${ORACLE_URL_BASE}/creators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creatorsAddresses),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

export const getAmountToReturnForPriceBasedLoan = (loan: LoanView): number => {
  const { amountToGet, rewardAmount, feeAmount, royaltyAmount } = loan;

  return ((amountToGet + rewardAmount + feeAmount + royaltyAmount) / 10 ** SOL_TOKEN.decimals);
};

export const getWhitelistedMintsDictionary = (pool): Dictionary<boolean> => {
  return Object.fromEntries(
    pool.poolWhitelist
      .filter(({ whitelistType }) => whitelistType === PoolWhitelistType.SINGLE_NFT_WHITELIST)
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true]),
  );
};

export const getWhitelistedCreatorsDictionary = (pool): Dictionary<boolean> => {
  return Object.fromEntries(
    pool.poolWhitelist
      .filter(({ whitelistType }) => whitelistType === PoolWhitelistType.CREATOR_WHITELIST)
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true])
  );
};

export const isNFTWhitelistedByCreator = (nft: UserNFT, whitelistedCreatorsDictionary: Dictionary<boolean>): string | null => {
  const { metadata } = nft;

  const nftCreatorAddresses = metadata?.properties?.creators?.filter(({ verified }) => !!verified)?.map(({ address }) => address) || [];
  const whitelistedCreatorsAddresses = Object.keys(whitelistedCreatorsDictionary);
  const whitelistedCreator = whitelistedCreatorsAddresses.find((whitelistedCreatorAddress) => nftCreatorAddresses.includes(whitelistedCreatorAddress));

  return whitelistedCreator || null;
};

export const isNFTWhitelistedByMint = (nft: UserNFT, whitelistedMintsDictionary: Dictionary<boolean>): string | null => {
  const { mint } = nft;

  return whitelistedMintsDictionary[mint] ? mint : null;
};

export const isNFTWhitelisted = (
  nft: UserNFT,
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): boolean => (
  (
    !!isNFTWhitelistedByMint(nft, whitelistedMintsDictionary) ||
    !!isNFTWhitelistedByCreator(nft, whitelistedCreatorsDictionary)
  ) && !nft?.metadata?.name?.includes('SSBxSolPunk')
);

export const filterWhitelistedNFTs = (
  nfts: UserNFT[],
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>
): UserNFT[] => (
  nfts.filter((nft) =>
    isNFTWhitelisted(
      nft,
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    ),
  )
);

export const getOutputAmount = ({
  poolKeys,
  poolInfo,
  payToken,
  payAmount,
  receiveToken,
  slippage = new Percent(1, 100),
}: AmountOutParams): {
  amountOut: string;
  minAmountOut: string;
  priceImpact: string;
} => {
  try {
    const amountIn = new TokenAmount(
      new Token(
        payToken.address,
        payToken.decimals,
        payToken.symbol,
        payToken.name,
      ),
      payAmount,
      false,
    );

    const { amountOut, minAmountOut, priceImpact } = Liquidity.computeAmountOut(
      {
        poolKeys,
        poolInfo,
        amountIn,
        currencyOut: receiveToken,
        slippage,
      },
    );

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

export const getInputAmount = ({
 poolKeys,
 poolInfo,
 receiveToken,
 receiveAmount,
 payToken,
 slippage = new Percent(1, 100),
}: AmountInParams): {
  amountIn: string;
  maxAmountIn: string;
  priceImpact: string;
} => {
  try {
    const amountOut = new TokenAmount(
      new Token(
        receiveToken.address,
        receiveToken.decimals,
        receiveToken.symbol,
        receiveToken.name,
      ),
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

export const fetchRaydiumPoolsInfo = (connection: Connection) => (
  async (raydiumPoolConfigs: LiquidityPoolKeysV4[]): Promise<LiquidityPoolInfo[]> => (
    await Liquidity.fetchMultipleInfo({ connection, pools: raydiumPoolConfigs })
  )
);

export const fetchRaydiumPoolsInfoMap = async (
  connection: Connection,
  raydiumPoolConfigs: LiquidityPoolKeysV4[],
): Promise<RaydiumPoolInfoMap> => {

  const raydiumPoolInfoMap = new Map<string, LiquidityPoolInfo>();

  const allPoolsInfo = await Promise.all(
    raydiumPoolConfigs.map((poolKey) =>
      Liquidity.fetchInfo({ connection, poolKeys: poolKey }),
    )
  );

  allPoolsInfo.forEach((poolInfo, idx) => {
    raydiumPoolInfoMap.set(
      raydiumPoolConfigs?.[idx]?.baseMint.toBase58(),
      poolInfo,
    );
  });

  return raydiumPoolInfoMap;
};

export const fetchPoolDataByMint: FetchPoolDataByMint = async ({ connection , tokensMap }) => {
  const allRaydiumConfigs = await Liquidity.fetchAllPoolKeys(connection);

  return allRaydiumConfigs.reduce((acc, raydiumPoolConfig) => {
    const { id, baseMint, quoteMint } = raydiumPoolConfig;

    const tokenInfo = tokensMap.get(baseMint.toBase58());

    if (
      tokenInfo &&
      quoteMint.toBase58() === WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    ) {
      acc.set(baseMint.toBase58(), {
        tokenInfo,
        poolConfig: raydiumPoolConfig,
      });
    }

    return acc;
  }, new Map<string, PoolData>());
};

export const fetchLoanDataByPoolPublicKey = async (connection: Connection, loansProgramPubkey: string): Promise<LoanDataByPoolPublicKey> => {
  const { collectionInfos, deposits, liquidityPools, loans } =
    await getAllProgramAccounts(new PublicKey(loansProgramPubkey), connection);

  const collectionInfosByPoolPublicKey = groupBy(
    collectionInfos,
    'liquidityPool',
  );
  const depositsByPoolPublicKey = groupBy(deposits, 'liquidityPool');
  const loansByPoolPublicKey = groupBy(loans, 'liquidityPool');

  return liquidityPools?.reduce((loansData, liquidityPool) => {
    const { liquidityPoolPubkey } = liquidityPool;

    return loansData.set(liquidityPoolPubkey, {
      collectionsInfo:
        collectionInfosByPoolPublicKey[liquidityPoolPubkey] || [],
      deposits: depositsByPoolPublicKey[liquidityPoolPubkey] || [],
      liquidityPool: liquidityPool,
      loans: loansByPoolPublicKey[liquidityPoolPubkey] || [],
    });
  }, new Map<string, LoanData>());
};
