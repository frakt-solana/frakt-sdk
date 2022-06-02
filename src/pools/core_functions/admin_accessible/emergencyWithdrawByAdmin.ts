import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';

import { findAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '../../../common/utils';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';

export interface EmergencyWithdrawByAdmin {
  communityPool: PublicKey;
  safetyDepositBox: PublicKey;
  nftMint: PublicKey;
  storeNftTokenAccount: PublicKey;
  programId: PublicKey;
  admin: PublicKey;
  provider: anchor.Provider;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

const emergencyWithdrawByAdmin = async (params: EmergencyWithdrawByAdmin) => {
  const { communityPool, safetyDepositBox, nftMint, storeNftTokenAccount, programId, admin, provider, sendTxn } =
    params;

  let instructions: TransactionInstruction[] = [];
  const signers = [];

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const nftAdminTokenAccount = await findAssociatedTokenAddress(admin, nftMint);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const nftAdmin = await provider.connection.getAccountInfo(nftAdminTokenAccount);

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
};

export default emergencyWithdrawByAdmin;
