import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
const encoder = new TextEncoder();

export async function approveLoanByAdmin({
  programId,
  provider,
  admin,
  loan,
  liquidityPool,
  collectionInfo,
  nftPrice,
  discount,
  user,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  loan: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;

  nftPrice: number | anchor.BN;
  discount: number | anchor.BN;
  user: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );

  const instr = program.instruction.approveLoanByAdmin(new anchor.BN(nftPrice), new anchor.BN(discount), {
    accounts: {
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instr);

  await sendTxn(transaction);
}
