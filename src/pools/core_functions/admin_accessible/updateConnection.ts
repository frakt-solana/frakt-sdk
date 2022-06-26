import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { UpdateConnection } from '../../types';

export const updateConnection = async (params: UpdateConnection) => {
  const { programId, connection, userPubkey, communityPool, fractionMint, fusion, sendTxn } = params;

  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

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
