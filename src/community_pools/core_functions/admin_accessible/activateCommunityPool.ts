import * as anchor from '@project-serum/anchor';

import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function activateCommunityPool(
  { communityPool }: { communityPool: PublicKey },
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
  const tx = program.instruction.activatePool({
    accounts: {
      communityPool: communityPool,
      authority: userPubkey,
      systemProgram: SystemProgram.programId,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction, signers);
}
