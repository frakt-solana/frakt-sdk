import { Transaction, SystemProgram } from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { ActivateCommunityPool } from '../../types';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export const activateCommunityPool = async (params: ActivateCommunityPool): Promise<any> => {
  const { communityPool, programId, userPubkey, provider, sendTxn } = params;

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
};
