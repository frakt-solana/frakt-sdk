import { AnchorProvider, web3, Program } from '@project-serum/anchor';
import { Spl, SPL_ACCOUNT_LAYOUT } from '@raydium-io/raydium-sdk';

import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID } from './constants';
import { NodeWallet } from './classes/nodewallet';
import { AccountInfoData, AccountInfoParsed, GetTokenAccount, ParseTokenAccount, UserNFT } from './types';
import idl from './idl/multi_reward_staking.json';

//when we only want to view vaults, no need to connect a real wallet.
export const createFakeWallet = () => {
  const leakedKp = web3.Keypair.fromSecretKey(
    Uint8Array.from([
      208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242, 120, 4, 78, 75, 19, 227, 13, 215, 184,
      108, 226, 53, 111, 149, 179, 84, 137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158, 226,
      207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
    ]),
  );
  return new NodeWallet(leakedKp);
};

export const findAssociatedTokenAddress = async (
  walletAddress: web3.PublicKey,
  tokenMintAddress: web3.PublicKey,
): Promise<web3.PublicKey> =>
  (
    await web3.PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];

export const getTokenBalance = async (pubkey: web3.PublicKey, connection: web3.Connection) => {
  const balance = await connection.getTokenAccountBalance(pubkey);

  return parseInt(balance.value.amount);
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: web3.PublicKey,
  payer: web3.PublicKey,
  walletAddress: web3.PublicKey,
  splTokenMintAddress: web3.PublicKey,
): web3.TransactionInstruction[] => {
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
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  return [
    new web3.TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    }),
  ];
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
  provider: AnchorProvider,
): Promise<Program> => {
  return new Program(idl as any, programId, provider);
};
