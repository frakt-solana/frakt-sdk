import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type RevealLotTicketByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  lotTicket: web3.PublicKey;
  isWinning: boolean;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const revealLotTicketByAdmin: RevealLotTicketByAdmin = async ({
  programId,
  connection,
  admin,
  lotTicket,
  isWinning,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);

  const ix = program.instruction.revealLotTicketByAdmin(isWinning, {
    accounts: {
      admin,
      lotTicket,
    },
  });
  const transaction = new web3.Transaction().add(ix);

  await sendTxn(transaction);
};
