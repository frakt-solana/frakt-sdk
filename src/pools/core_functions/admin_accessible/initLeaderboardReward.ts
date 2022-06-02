import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
export { Provider, Program } from '@project-serum/anchor';
import { Transaction, SystemProgram } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { InitLeaderboardReward } from '../../types';

export const initLeaderboardReward = async (params: InitLeaderboardReward) => {
  const { communityPool, fractionMint, depositReward, withdrawReward, programId, admin, provider, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const [leaderboardAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const instruction = program.instruction.initializeLeaderboard(depositReward, withdrawReward, {
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
};
