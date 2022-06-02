import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common/utils';

export interface HarvestScore {
  programId: PublicKey;
  provider: anchor.Provider;
  userPublicKey: PublicKey;
  tokenMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

const harvestScore = async (params: HarvestScore) => {
  const { programId, provider, userPublicKey, tokenMint, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpBoard] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPublicKey.toBuffer()],
    program.programId,
  );

  const [config, bumpConfig] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const [vaultOwnerPda, bumpAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), program.programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await findAssociatedTokenAddress(vaultOwnerPda, tokenMint);
  const userTokenAccount = await findAssociatedTokenAddress(userPublicKey, tokenMint);

  const instruction = await program.instruction.harvestScore(bumpBoard, bumpAuth, bumpConfig, {
    accounts: {
      user: userPublicKey,
      tokenMint: tokenMint,
      userTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default harvestScore;
