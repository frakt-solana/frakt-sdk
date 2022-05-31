import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export interface UpdateFee {
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  config: PublicKey,
  depositFeeAdmin: number,
  depositFeePool: number,
  getLotteryFeeAdmin: number,
  getLotteryFeePool: number,
  sendTxn: (transaction: Transaction) => Promise<void>
}

const updateFee = async (params: UpdateFee) => {
  const {
    programId,
    provider,
    userPubkey,
    config,
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    sendTxn
  } = params;

  const transaction = new Transaction();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const instruction = await program.instruction.updateFee(depositFeeAdmin, depositFeePool, getLotteryFeeAdmin, getLotteryFeePool, {
    accounts: {
      admin: userPubkey,
      config: config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  transaction.add(instruction);

  await sendTxn(transaction);
}

export default updateFee;
