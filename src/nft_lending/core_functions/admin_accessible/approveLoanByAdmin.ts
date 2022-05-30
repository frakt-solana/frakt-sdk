import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnAnchorProgram } from '../../contract_model/accounts';

const approveLoanByAdmin = async (
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  loan: PublicKey,
  liquidityPool: PublicKey,
  collectionInfo: PublicKey,
  nftPrice: number | anchor.BN,
  discount: number | anchor.BN,
  user: PublicKey,
  sendTxn: (transaction: Transaction) => Promise<void>
): Promise<any> => {
  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

  const [liqOwner] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );

  const instruction = program.instruction.approveLoanByAdmin(new anchor.BN(nftPrice), new anchor.BN(discount), {
    accounts: {
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default approveLoanByAdmin;
