import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

const updateLeaderboardReward = async (
  communityPool: PublicKey,
  fractionMint: PublicKey,
  depositReward: anchor.BN,
  withdrawReward: anchor.BN,
  programId: PublicKey,
  admin: PublicKey,
  provider: anchor.Provider,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
) => {
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const [leaderboardAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const instruction = program.instruction.updateLeaderboard(bump, depositReward, withdrawReward, {
    accounts: {
      communityPool,
      fractionMint,
      admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      leaderboardAccount,
    },
  });

  const transaction = new Transaction();
  transaction.add(instruction);

  await sendTxn(transaction, []);
}

export default updateLeaderboardReward;
