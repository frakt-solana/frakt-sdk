import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type InitializeNftAttemptsByStaking = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  fraktNftStake: web3.PublicKey;
  attemptsNftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<web3.PublicKey>;

export const initializeNftAttemptsByStaking: InitializeNftAttemptsByStaking = async ({
  programId,
  connection,
  user,
  fraktNftStake,
  attemptsNftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();

  let program = returnAnchorProgram(programId, connection);
  const lotTicket = web3.Keypair.generate();
  const [nftAttempts, nftAttemptsBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftattempts'), programId.toBuffer(), attemptsNftMint.toBuffer()],
    program.programId,
  );

  const instructions: web3.TransactionInstruction[] = [];
  if (!(await connection.getAccountInfo(nftAttempts, 'confirmed'))) {
    instructions.push(
      program.instruction.initializeNftAttemptsByStaking({
        accounts: {
          nftAttempts,
          user,
          nftMint: attemptsNftMint,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
          //   frakt_nft_stake_account
          fraktNftStakeAccount: fraktNftStake,
        },
      }),
    );
  }

  //   instructions.push(
  //     program.instruction.getLotTicket(nftAttemptsBump, {
  //       accounts: {
  //         liquidationLot,
  //         nftAttempts,
  //         user: user,
  //         lotTicket: lotTicket.publicKey,
  //         attemptsNftMint: attemptsNftMint,
  //         systemProgram: web3.SystemProgram.programId,
  //       },
  //     }),
  //   );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  await sendTxn(transaction, []);
  return lotTicket.publicKey;
};
