import * as anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnAnchorProgram } from '../../contract_model/accounts';

interface IParams {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

// TODO: Нужен один в рамках модуля или на каждый вызов?
const encoder = new TextEncoder();

const depositLiquidity = async ({
  programId,
  provider,
  liquidityPool,
  user,
  amount,
  sendTxn
}: IParams): Promise<any> => {
  const program = await returnAnchorProgram(programId, provider);

  const [liqOwner] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.depositLiquidity(new anchor.BN(amount), {
    accounts: {
      liquidityPool: liquidityPool,
      liqOwner,
      deposit,
      user: user,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default depositLiquidity;
