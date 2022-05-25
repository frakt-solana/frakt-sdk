import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function initializeFee(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  depositFeeAdmin: number,
  depositFeePool: number,
  getLotteryFeeAdmin: number,
  getLotteryFeePool: number,
  sendTxn: any,
  communityPool?: PublicKey,
) {
  let config = anchor.web3.Keypair.generate();
  const transaction = new Transaction();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  if (communityPool == null) {
    communityPool = new PublicKey('11111111111111111111111111111111');
  }

  const signers = [config];
  let ix = await program.instruction.initializeFee(
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    {
      accounts: {
        config: config.publicKey,
        admin: userPubkey,
        communityPool,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [config],
    },
  );

  transaction.add(ix);

  await sendTxn(transaction, signers);

  return config.publicKey;
}
