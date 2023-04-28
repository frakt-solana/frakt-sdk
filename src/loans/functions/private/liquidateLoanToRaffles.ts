import { web3, utils, BN } from '@project-serum/anchor';

import { findRuleSetPDA, findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

type LiquidateLoanToRaffles = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  liquidator: web3.PublicKey;

  gracePeriod: number;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
}) => Promise<{ ixs: web3.TransactionInstruction[], liquidationLot: web3.Signer }>;

export const liquidateLoanToRaffles: LiquidateLoanToRaffles = async ({
  programId,
  connection,
  user,
  liquidator,
  gracePeriod,
  loan,
  nftMint,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const liquidationLot = web3.Keypair.generate();
  const nftMetadata = getMetaplexMetadata(nftMint);

  // const ruleSet = await findRuleSetPDA(payerRuleSet, nameForRuleSet);
  const ownerTokenRecord = findTokenRecordPda(nftMint, nftUserTokenAccount)
  const destTokenRecord = findTokenRecordPda(nftMint, vaultNftTokenAccount)

  const metadataAccount = await Metadata.fromAccountAddress(connection, nftMetadata);

  const ruleSet = metadataAccount.programmableConfig?.ruleSet;


  const ix = await program.methods.liquidateNftToRaffles(new BN(gracePeriod), null)
    .accountsStrict({
      loan,
      liquidationLot: liquidationLot.publicKey,
      user,
      liquidator: liquidator,
      nftMint,
      vaultNftTokenAccount,
      nftUserTokenAccount,
      communityPoolsAuthority,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      nftMetadata,
      ownerTokenRecord,
      destTokenRecord,
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    }).remainingAccounts(
      [
        {
          pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ],
    ).instruction()
  const ixs: web3.TransactionInstruction[] = []
  ixs.push(web3.ComputeBudgetProgram.requestUnits({
    units: 450000,
    additionalFee: 0,
  }))
  ixs.push(ix)
  return { ixs, liquidationLot };
};
