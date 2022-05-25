import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function updateFee(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  config: PublicKey,
  depositFeeAdmin: number,
  depositFeePool: number,
  getLotteryFeeAdmin: number,
  getLotteryFeePool: number,
  sendTxn: any,
) {
  const transaction = new Transaction();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let ix = await program.instruction.updateFee(depositFeeAdmin, depositFeePool, getLotteryFeeAdmin, getLotteryFeePool, {
    accounts: {
      admin: userPubkey,
      config: config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  transaction.add(ix);

  await sendTxn(transaction, []);
}
