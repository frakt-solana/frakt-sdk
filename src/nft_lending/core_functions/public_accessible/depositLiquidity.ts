import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
const encoder = new TextEncoder();

export async function depositLiquidity({
  programId,
  provider,
  liquidityPool,
  user,
  amount,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const [deposit, depositBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );
  const instr = program.instruction.depositLiquidity(new anchor.BN(amount), {
    accounts: {
      liquidityPool: liquidityPool,
      liqOwner,
      deposit,
      user: user,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instr);
  await sendTxn(transaction);
}
