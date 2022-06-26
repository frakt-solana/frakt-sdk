import { web3 } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { InitializeFee } from '../../types';

export const initializeFee = async (params: InitializeFee): Promise<any> => {
  const {
    programId,
    connection,
    userPubkey,
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    sendTxn,
    communityPool = new web3.PublicKey('11111111111111111111111111111111'),
  } = params;

  const config = web3.Keypair.generate();
  const transaction = new web3.Transaction();
  const signers = [config];

  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const instruction = await program.instruction.initializeFee(
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    {
      accounts: {
        config: config.publicKey,
        admin: userPubkey,
        communityPool,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [config],
    },
  );

  transaction.add(instruction);

  await sendTxn(transaction, signers);

  return config.publicKey;
};
