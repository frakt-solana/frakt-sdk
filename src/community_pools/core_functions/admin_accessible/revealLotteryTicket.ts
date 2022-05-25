import * as anchor from '@project-serum/anchor';

import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function revealLotteryTicket(
  {
    communityPool,
    lotteryTicket,
    safetyDepositBox,
  }: { communityPool: PublicKey; lotteryTicket: PublicKey; safetyDepositBox: PublicKey },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const signers = [];
  const tx = program.instruction.revealLotteryTicket({
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      admin: userPubkey,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction, signers);
}
