import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
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

type stopLiquidationRafflesByAdminParams = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidationLot: web3.PublicKey;
  loan: web3.PublicKey;
}) => Promise<{ ixs: web3.TransactionInstruction[] }>;

export const stopLiquidationRaffles: stopLiquidationRafflesByAdminParams = async ({
  programId,
  connection,
  admin,
  nftMint,
  liquidationLot,
  loan,
}) => {
  const encoder = new TextEncoder();

  const program = returnAnchorProgram(programId, connection);
  const nftAdminTokenAccount = await findAssociatedTokenAddress(admin, nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const nftMetadata = getMetaplexMetadata(nftMint);
  const ownerTokenRecord = findTokenRecordPda(nftMint, vaultNftTokenAccount);
  const destTokenRecord = findTokenRecordPda(nftMint, nftAdminTokenAccount);
  const metadataAccount = await Metadata.fromAccountAddress(connection, nftMetadata);
  const editionInfo = getMetaplexEditionPda(nftMint);

  const ruleSet = metadataAccount.programmableConfig?.ruleSet;

  const ix = await program.methods
    .stopLiquidationRafflesByAdmin(null)
    .accountsStrict({
      admin,
      nftMint,
      communityPoolsAuthority,
      liquidationLot,
      loan,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      nftMetadata,
      ownerTokenRecord,
      destTokenRecord,
      editionInfo,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      vaultNftTokenAccount,
      nftAdminTokenAccount,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
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
    web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 450000,
    }),
  );
  ixs.push(ix);
  return { ixs };
};
