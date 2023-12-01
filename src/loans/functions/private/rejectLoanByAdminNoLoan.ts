import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { web3, utils } from '@project-serum/anchor';

import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';
import {
  findRuleSetPDA,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from '../../helpers';

type RejectLoanByAdminNoLoan = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  nftUserTokenAccount: web3.PublicKey;
  admin: web3.PublicKey;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
}) => Promise<{ ixs: web3.TransactionInstruction[] }>;

export const rejectLoanByAdminNoLoan: RejectLoanByAdminNoLoan = async ({
  programId,
  connection,
  nftUserTokenAccount,
  admin,
  user,
  nftMint,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);
  const editionId = getMetaplexEditionPda(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );
  const nftMetadata = getMetaplexMetadata(nftMint);
  const tokenRecordInfo = findTokenRecordPda(nftMint, nftUserTokenAccount);
  const metadataAccount = await Metadata.fromAccountAddress(connection, nftMetadata);

  const ruleSet = metadataAccount.programmableConfig?.ruleSet;

  const ix = await program.methods
    .rejectLoanByAdminNoLoan()
    .accountsStrict({
      admin: admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      user: user,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      nftMetadata,
      tokenRecordInfo,
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      communityPoolsAuthority,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
    })
    .remainingAccounts([
      {
        pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ])
    .instruction();
  const ixs: web3.TransactionInstruction[] = [];
  // ixs.push(
  //   web3.ComputeBudgetProgram.requestUnits({
  //     units: 450000,
  //     additionalFee: 0,
  //   }),
  // );
  ixs.push(ix);
  return { ixs };
};
