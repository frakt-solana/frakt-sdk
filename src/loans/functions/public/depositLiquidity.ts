import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
import { createFakeWallet } from '../../../common';

import { returnAnchorProgram } from '../../helpers';

type DepositLiquidity = (params: {
  programId: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  amount: number;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<web3.PublicKey>;

export const depositLiquidity: DepositLiquidity = async ({
  programId,
  liquidityPool,
  connection,
  user,
  amount,
  sendTxn,
}): Promise<web3.PublicKey> => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.depositLiquidity(new BN(amount), {
    accounts: {
      liquidityPool: liquidityPool,
      liqOwner,
      deposit,
      user: user,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
  return deposit;
};
