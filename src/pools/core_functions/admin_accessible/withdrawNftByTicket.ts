import { web3 } from '@project-serum/anchor';

import { findAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '../../../common';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';
import { WithdrawNftByTicket } from '../../types';
import { TOKEN_PROGRAM_ID } from '../../../common/constants';

export const withdrawNftByTicket = async (params: WithdrawNftByTicket) => {
  const {
    communityPool,
    lotteryTicket,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
    programId,
    userPubkey,
    connection,
    sendTxn,
  } = params;

  let instructions: web3.TransactionInstruction[] = [];
  const signers = [];
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(userPubkey, nftMint);
  const nftUser = await connection.getAccountInfo(nftUserTokenAccount);

  if (!nftUser) {
    instructions = instructions.concat(createAssociatedTokenAccountInstruction(nftUserTokenAccount, userPubkey, userPubkey, nftMint));
  }

  const instruction = program.instruction.withdrawNftByTicket(bump, {
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftUserTokenAccount,
      nftMint: nftMint,
      storeNftTokenAccount: storeNftTokenAccount,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
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
