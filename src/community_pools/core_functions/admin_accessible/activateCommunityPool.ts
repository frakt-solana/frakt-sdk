import anchor from '@project-serum/anchor';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

const activateCommunityPool = async (
  communityPool: PublicKey,
  programId: PublicKey,
  userPubkey: PublicKey,
  provider: anchor.Provider,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
): Promise<any> => {
  const signers = [];

  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const instruction = program.instruction.activatePool({
    accounts: {
      communityPool: communityPool,
      authority: userPubkey,
      systemProgram: SystemProgram.programId,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, signers);
}

export default activateCommunityPool;
