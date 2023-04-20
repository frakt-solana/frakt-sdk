import { web3, utils, BN } from '@project-serum/anchor';

import {
  findRuleSetPDA,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';

type PutLoanToLiquidationRaffles = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  gracePeriod: number;
  ruleSet?: web3.PublicKey;
}) => Promise<{ ixs: web3.TransactionInstruction[]; liquidationLot: web3.Signer }>;

export const putLoanToLiquidationRaffles: PutLoanToLiquidationRaffles = async ({
  programId,
  connection,
  admin,
  loan,
  nftMint,
  gracePeriod,
  ruleSet,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);
  const nftAdminTokenAccount = await findAssociatedTokenAddress(admin, nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const liquidationLot = web3.Keypair.generate();

  const editionId = getMetaplexEditionPda(nftMint);
  const ownerTokenRecord = findTokenRecordPda(nftMint, nftAdminTokenAccount);
  const destTokenRecord = findTokenRecordPda(nftMint, vaultNftTokenAccount);

  const nftMetadata = getMetaplexMetadata(nftMint);

  const ix = await program.methods
    .putLoanToLiquidationRaffles(null, new BN(gracePeriod))
    .accountsStrict({
      loan: loan,
      liquidationLot: liquidationLot.publicKey,
      admin: admin,
      nftMint: nftMint,
      vaultNftTokenAccount: vaultNftTokenAccount,
      nftAdminTokenAccount: nftAdminTokenAccount,
      communityPoolsAuthority,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
      nftMetadata,
      ownerTokenRecord,
      destTokenRecord,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
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
  ixs.push(
    web3.ComputeBudgetProgram.requestUnits({
      units: 400000,
      additionalFee: 0,
    }),
  );
  ixs.push(ix);

  // const transaction = new web3.Transaction().add(instruction);
  // await sendTxn(transaction, [liquidationLotAccount]);
  return { ixs, liquidationLot };
};
