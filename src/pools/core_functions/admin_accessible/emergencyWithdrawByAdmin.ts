import { web3 } from '@project-serum/anchor';

import { findAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '../../../common';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';
import { EmergencyWithdrawByAdmin } from '../../types';
import { TOKEN_PROGRAM_ID } from '../../../common/constants';

export const emergencyWithdrawByAdmin = async (params: EmergencyWithdrawByAdmin) => {
  const { communityPool, safetyDepositBox, nftMint, storeNftTokenAccount, programId, admin, connection, sendTxn } =
    params;

  let instructions: web3.TransactionInstruction[] = [];
  const signers = [];

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);
  const nftAdminTokenAccount = await findAssociatedTokenAddress(admin, nftMint);

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const nftAdmin = await connection.getAccountInfo(nftAdminTokenAccount);

  if (!nftAdmin) {
    instructions = [
      ...instructions,
      ...createAssociatedTokenAccountInstruction(nftAdminTokenAccount, admin, admin, nftMint),
    ];
  }

  const instruction = program.instruction.emergencyWithdrawByAdmin(bump, {
    accounts: {
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftAdminTokenAccount,
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
