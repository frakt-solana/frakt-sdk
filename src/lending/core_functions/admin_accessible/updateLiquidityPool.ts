import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnAnchorProgram } from '../../contract_model/accounts';

export interface UpdateLiquidityPool {
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  liquidityPool: PublicKey,
  rewardInterestRateTime: number | anchor.BN,
  feeInterestRateTime: number | anchor.BN,
  rewardInterestRatePrice: number | anchor.BN,
  feeInterestRatePrice: number | anchor.BN,
  id: number | anchor.BN,
  period: number | anchor.BN,
  sendTxn: (transaction: Transaction) => Promise<void>
}

const updateLiquidityPool = async (params: UpdateLiquidityPool): Promise<any> => {
  const {
    programId,
    provider,
    admin,
    liquidityPool,
    rewardInterestRateTime,
    feeInterestRateTime,
    rewardInterestRatePrice,
    feeInterestRatePrice,
    id,
    period,
    sendTxn
  } = params;

  const program = await returnAnchorProgram(programId, provider);

  const instruction = program.instruction.updateLiquidityPool(
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

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default updateLiquidityPool;
