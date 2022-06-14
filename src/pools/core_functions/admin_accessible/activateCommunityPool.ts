import { web3 } from'@project-serum/anchor';

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
      systemProgram: web3.SystemProgram.programId,
    },
    signers: signers,
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, signers);
};
