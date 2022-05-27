import anchor from '@project-serum/anchor';
import { Connection, PublicKey, Keypair, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { NodeWallet } from '@metaplex/js';

import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from './constants';

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
): Promise<PublicKey> =>
  (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];

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

  const initAccountInstruction = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, accountPubkey, owner);

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
  // // 1 verify the owner of the account is metaplex's metadata program
  // assert_eq!(nft_metadata.owner, &metadata_program);

  // // 2 verify the PDA seeds match
  // let seed = &[
  //     b"metadata".as_ref(),
  //     metadata_program.as_ref(),
  //     nft_mint.as_ref(),
  // ];

  const [metadataPubkey] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('metadata'), metadata_program.toBuffer(), nftMint.toBuffer()],
    metadata_program,
  );

  return metadataPubkey;
  // let (metadata_addr, _bump) = Pubkey::find_program_address(seed, &metadata_program);
  // assert_eq!(metadata_addr, nft_metadata.key());
};
