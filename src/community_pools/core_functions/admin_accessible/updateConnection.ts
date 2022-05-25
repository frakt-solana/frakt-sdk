import * as anchor from '@project-serum/anchor';

import { PublicKey } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function updateConnection(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  communityPool: PublicKey,
  fractionMint: PublicKey,
  fusion: PublicKey,
  sendTxn: any,
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let tx = await program.transaction.updateConnection({
    accounts: {
      admin: userPubkey,
      communityPool,
      fractionMint,
      router: fusion,
    },
  });

  await sendTxn(tx, []);
}
