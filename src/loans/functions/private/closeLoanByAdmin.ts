import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type CloseLoanByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  loan: web3.PublicKey;
  admin: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<{ix: web3.TransactionInstruction}>;

export const closeLoanByAdmin: CloseLoanByAdmin = async ({ programId, connection, loan, admin, sendTxn }) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const ix = await program.methods
    .closeLoan()
    .accountsStrict({
      loan: loan,
      admin: admin,
    })
    .instruction();

  return {ix};
};
