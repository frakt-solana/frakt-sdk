import { web3 } from'@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { findAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '../../../common';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';
import { WithdrawNftByAdmin } from '../../types';

export const withdrawNftByAdmin = async (params: WithdrawNftByAdmin) => {
  const {
    communityPool,
    lotteryTicket,
    ticketHolder,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
    programId,
    admin,
    provider,
    sendTxn,
  } = params;

  let instructions: web3.TransactionInstruction[] = [];
  const signers = [];

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
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
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new web3.Transaction();

  for (const instruction of instructions) {
    transaction.add(instruction);
  }

  transaction.add(instruction);

  await sendTxn(transaction, signers);
};
