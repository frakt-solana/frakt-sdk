import { web3, utils } from '@project-serum/anchor';

import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { findRuleSetPDA, findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from '../../helpers';

type RejectLoanByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  loan: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  admin: web3.PublicKey;
  payerRuleSet: web3.PublicKey;
  nameForRuleSet: string;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
}) => Promise<{ix: web3.TransactionInstruction}>;

export const rejectLoanByAdmin: RejectLoanByAdmin = async ({
  programId,
  connection,
  loan,
  nftUserTokenAccount,
  payerRuleSet,
  nameForRuleSet,
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
  const tokenRecordInfo = findTokenRecordPda(nftMint, nftUserTokenAccount)
  const ruleSet = await findRuleSetPDA(payerRuleSet, nameForRuleSet);

  const ix = await program.methods.rejectLoanByAdmin().accountsStrict({
      loan: loan,
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
    }).remainingAccounts(
      [
       {
         pubkey: ruleSet,
         isSigner: false,
         isWritable: false,
       },
     ],
   ).instruction();
  return {ix}
};
