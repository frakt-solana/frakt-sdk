import * as anchor from '@project-serum/anchor';

import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function updateConnection({
  programId,
  provider,
  userPubkey,
  communityPool,
  fractionMint,
  fusion,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  userPubkey: PublicKey;
  communityPool: PublicKey;
  fractionMint: PublicKey;
  fusion: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let tx = await program.transaction.updateConnection({
    accounts: {
      admin: userPubkey,
      communityPool,
      fractionMint,
      router: fusion,
    },
  });

  await sendTxn(tx);
}
