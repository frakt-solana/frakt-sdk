import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from './../../contract_model/accounts';
import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
const encoder = new TextEncoder();

export async function harvestLiquidity({
  programId,
  provider,
  liquidityPool,
  user,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
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
  const ix = program.instruction.harvestLiquidity(depositBump, {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
