import { BN, web3 } from '@project-serum/anchor';

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
      rewardInterestRateTime: new BN(rewardInterestRateTime),
      rewardInterestRatePrice: new BN(rewardInterestRatePrice),
      feeInterestRateTime: new BN(feeInterestRateTime),
      feeInterestRatePrice: new BN(feeInterestRatePrice),
      id: new BN(id),
      period: new BN(period),
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        admin: admin,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
