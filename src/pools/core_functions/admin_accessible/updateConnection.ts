import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { UpdateConnection } from '../../types';

export const updateConnection = async (params: UpdateConnection) => {
  const { programId, provider, userPubkey, communityPool, fractionMint, fusion, sendTxn } = params;

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
};
