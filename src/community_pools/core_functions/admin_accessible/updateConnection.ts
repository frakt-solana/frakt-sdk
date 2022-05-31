import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

const updateConnection = async (
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  communityPool: PublicKey,
  fractionMint: PublicKey,
  fusion: PublicKey,
  sendTxn: (transaction: Transaction) => Promise<void>
) => {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const transaction = await program.transaction.updateConnection({
    accounts: {
      admin: userPubkey,
      communityPool,
      fractionMint,
      router: fusion,
    },
  });

  await sendTxn(transaction);
}

export default updateConnection;
