import { web3, utils, BN } from '@project-serum/anchor';

import { findRuleSetPDA, findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';

type PaybackLoanIx = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  payerRuleSet: web3.PublicKey;
  nameForRuleSet: string;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
  paybackAmount?: BN;
}) => Promise<{paybackLoanIx: web3.TransactionInstruction}>;

export const paybackLoanIx: PaybackLoanIx = async ({
  programId,
  connection,
  user,
  admin,
  loan,
  payerRuleSet,
  nameForRuleSet,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
  paybackAmount = new BN(0),
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const nftMetadata = getMetaplexMetadata(nftMint);
  const tokenRecordInfo = findTokenRecordPda(nftMint, nftUserTokenAccount)
  const ruleSet = await findRuleSetPDA(payerRuleSet, nameForRuleSet);


  const instruction = await program.methods.paybackLoan(paybackAmount).accountsStrict({
      loan: loan,
      liquidityPool: liquidityPool,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY, 
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      nftMetadata, 
      tokenRecordInfo,
      liqOwner,
      communityPoolsAuthority,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      // associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
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
   ).instruction()
  return {paybackLoanIx: instruction}
};
