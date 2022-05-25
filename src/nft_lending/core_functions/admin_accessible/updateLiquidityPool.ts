import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
const encoder = new TextEncoder();

export async function updateLiquidityPool({
  programId,
  provider,
  admin,
  liquidityPool,
  rewardInterestRateTime,
  rewardInterestRatePrice,
  feeInterestRateTime,
  feeInterestRatePrice,
  id,
  period,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  liquidityPool: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const ix = program.instruction.updateLiquidityPool(
    {
      rewardInterestRateTime: new anchor.BN(rewardInterestRateTime),
      rewardInterestRatePrice: new anchor.BN(rewardInterestRatePrice),
      feeInterestRateTime: new anchor.BN(feeInterestRateTime),
      feeInterestRatePrice: new anchor.BN(feeInterestRatePrice),
      id: new anchor.BN(id),
      period: new anchor.BN(period),
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        admin: admin,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
