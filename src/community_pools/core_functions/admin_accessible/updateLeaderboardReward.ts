import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';
const encoder = new TextEncoder();

export async function updateLeaderboardReward(
  {
    communityPool,
    fractionMint,
    depositReward,
    withdrawReward,
  }: { communityPool: PublicKey; fractionMint: PublicKey; depositReward: anchor.BN; withdrawReward: anchor.BN },
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
  const [leaderboardAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const ix = program.instruction.updateLeaderboard(bump, depositReward, withdrawReward, {
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
  transaction.add(ix);
  await sendTxn(transaction, []);
}
