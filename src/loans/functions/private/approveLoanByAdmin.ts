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
}) => Promise<{ix: web3.TransactionInstruction}>;

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
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );

  const ix = await program.methods.approveLoanByAdmin(new BN(nftPrice), new BN(discount))
    .accountsStrict({
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      systemProgram: web3.SystemProgram.programId,
    }).instruction();

  return {ix}
};
