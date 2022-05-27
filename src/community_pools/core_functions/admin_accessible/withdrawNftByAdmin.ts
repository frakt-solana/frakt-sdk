import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import * as utils from './../../../common/utils';

import { PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';
import { ACCOUNT_PREFIX } from './../../constants';

export { Provider, Program } from '@project-serum/anchor';
const encoder = new TextEncoder();

export async function withdrawNftByAdmin(
  {
    communityPool,
    lotteryTicket,
    ticketHolder,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
  }: {
    communityPool: PublicKey;
    lotteryTicket: PublicKey;
    ticketHolder: PublicKey;
    safetyDepositBox: PublicKey;
    nftMint: PublicKey;
    storeNftTokenAccount: PublicKey;
  },
  {
    admin,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    admin: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  let instructions: TransactionInstruction[] = [];
  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(ticketHolder, nftMint);
  if (!(await provider.connection.getAccountInfo(nftUserTokenAccount)))
    instructions = [
      ...instructions,
      ...(await utils.createAssociatedTokenAccountInstruction(nftUserTokenAccount, admin, ticketHolder, nftMint)),
    ];

  const signers = [];

  const withdrawIx = program.instruction.withdrawNftByAdmin(bump, {
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftUserTokenAccount,
      nftMint: nftMint,
      storeNftTokenAccount: storeNftTokenAccount,
      communityPoolsAuthority: community_pools_authority,
      admin: admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(withdrawIx);

  await sendTxn(transaction, signers);
}
