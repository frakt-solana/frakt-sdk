import * as anchor from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';

import { UpdateLiquidityPool } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const updateLiquidityPool = async (params: UpdateLiquidityPool): Promise<any> => {
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
    sendTxn,
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
