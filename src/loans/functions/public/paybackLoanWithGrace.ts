import { web3, utils } from '@project-serum/anchor';

import { getMetaplexEditionPda, returnAnchorProgram, findTokenRecordPda, getMetaplexMetadata, findRuleSetPDA } from '../../helpers';
import { createAssociatedTokenAccountInstruction, findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';

type PaybackLoanWithGraceIx = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  liquidationLot: web3.PublicKey;
  payerRuleSet: web3.PublicKey;
  nameForRuleSet: string;

  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
}) => Promise<{ixs: web3.TransactionInstruction[]}>;

export const paybackLoanWithGraceIx: PaybackLoanWithGraceIx = async ({
  programId,
  connection,
  user,
  admin,
  liquidationLot,
  payerRuleSet,
  nameForRuleSet,
  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
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
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const ruleSet = await findRuleSetPDA(payerRuleSet, nameForRuleSet);

  let ixs: web3.TransactionInstruction[] = [];
  const nftUserTokenAccountInfo = await connection.getAccountInfo(nftUserTokenAccount);
  if (!nftUserTokenAccountInfo)
    ixs = ixs.concat(
      createAssociatedTokenAccountInstruction(nftUserTokenAccount, user, user, nftMint),
    );
  const editionId = getMetaplexEditionPda(nftMint);
  const ownerTokenRecord = findTokenRecordPda(nftMint, vaultNftTokenAccount)
  const destTokenRecord = findTokenRecordPda(nftMint, nftUserTokenAccount)

  const nftMetadata = getMetaplexMetadata(nftMint);
  const mainIx = await program.methods.paybackWithGrace(null)
    .accountsStrict({
      loan: loan,
      liquidityPool,
      liquidationLot,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY, 
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      nftMetadata, 
      ownerTokenRecord, 
      destTokenRecord,
      liqOwner,
      communityPoolsAuthority,
      vaultNftTokenAccount,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
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

  ixs = ixs.concat(mainIx);

  // await sendTxn(transaction);
  return {ixs}
};
