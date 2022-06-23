import { AnchorProvider, BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UpdateTimeBasedLiquidityPool = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  admin: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  rewardInterestRateTime: number | BN;
  feeInterestRateTime: number | BN;
  rewardInterestRatePrice: number | BN;
  feeInterestRatePrice: number | BN;
  id: number | BN;
  period: number | BN;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const updateTimeBasedLiquidityPool: UpdateTimeBasedLiquidityPool = async ({
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
}) => {
  const program = returnAnchorProgram(programId, provider);

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