import * as anchor from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { UpdateFee } from '../../types';

export const updateFee = async (params: UpdateFee) => {
  const {
    programId,
    provider,
    userPubkey,
    config,
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    sendTxn,
  } = params;

  const transaction = new Transaction();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const instruction = await program.instruction.updateFee(
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    {
      accounts: {
        admin: userPubkey,
        config: config,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  transaction.add(instruction);

  await sendTxn(transaction);
};
