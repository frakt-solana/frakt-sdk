import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';

import { findAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '../../../common/utils';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';

const withdrawNftByAdmin = async (
  communityPool: PublicKey,
  lotteryTicket: PublicKey,
  ticketHolder: PublicKey,
  safetyDepositBox: PublicKey,
  nftMint: PublicKey,
  storeNftTokenAccount: PublicKey,
  programId: PublicKey,
  admin: PublicKey,
  provider: anchor.Provider,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
) => {
  let instructions: TransactionInstruction[] = [];
  const signers = [];

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(ticketHolder, nftMint);
  const nftUser = await provider.connection.getAccountInfo(nftUserTokenAccount);

  if (!nftUser) {
    instructions = [
      ...instructions,
      ...createAssociatedTokenAccountInstruction(nftUserTokenAccount, admin, ticketHolder, nftMint),
    ];
  }

  const instruction = program.instruction.withdrawNftByAdmin(bump, {
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

  for (const instruction of instructions) {
    transaction.add(instruction);
  }

  transaction.add(instruction);

  await sendTxn(transaction, signers);
}

export default withdrawNftByAdmin;
