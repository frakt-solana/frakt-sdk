import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type ApproveLoanByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  nftPrice: number | BN;
  discount: number | BN;
  user: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const approveLoanByAdmin: ApproveLoanByAdmin = async ({
  programId,
  connection,
  admin,
  loan,
  liquidityPool,
  collectionInfo,
  nftPrice,
  discount,
  user,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );

  const instruction = program.instruction.approveLoanByAdmin(new BN(nftPrice), new BN(discount), {
    accounts: {
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      systemProgram: web3.SystemProgram.programId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
