import { web3, utils } from '@project-serum/anchor';
import { findAssociatedTokenAddress } from '../../../common';

import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';
import {
  findRuleSetPDA,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from '../../helpers';

type returnFromGraceToActiveParams = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  loan: web3.PublicKey;
  admin: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidationLot: web3.PublicKey;
  user: web3.PublicKey;
}) => Promise<{ ixs: web3.TransactionInstruction[] }>;

export const returnFromGraceToActive: returnFromGraceToActiveParams = async ({
  programId,
  connection,
  loan,
  admin,
  liquidationLot,
  nftMint,
  user,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);

  const ix = await program.methods
    .returnFromGraceToActive()
    .accountsStrict({
      loan: loan,
      admin: admin,
      liquidationLot,
      user: user,
      vaultNftTokenAccount,
      communityPoolsAuthority,
      systemProgram: web3.SystemProgram.programId,
    })
    .instruction();
  const ixs: web3.TransactionInstruction[] = [];
  ixs.push(
    web3.ComputeBudgetProgram.requestUnits({
      units: 400000,
      additionalFee: 0,
    }),
  );
  ixs.push(ix);
  return { ixs };
};
