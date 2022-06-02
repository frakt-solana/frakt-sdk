import anchor from '@project-serum/anchor';

import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { returnAnchorProgram } from '../../contract_model/accounts';

export interface InitializeLiquidityPool {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

const initializeLiquidityPool = async (params: InitializeLiquidityPool): Promise<any> => {
  const {
    programId,
    provider,
    admin,
    rewardInterestRateTime,
    feeInterestRateTime,
    rewardInterestRatePrice,
    feeInterestRatePrice,
    id,
    period,
    sendTxn,
  } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const liquidityPool = Keypair.generate();

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.publicKey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initializeLiquidityPool(
    liqOwnerBump,
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
        liquidityPool: liquidityPool.publicKey,
        liqOwner,
        admin: admin,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, [liquidityPool]);

  return liquidityPool.publicKey;
};

export default initializeLiquidityPool;
