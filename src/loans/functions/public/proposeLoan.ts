import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { BN, web3, utils } from '@project-serum/anchor';

import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { findRuleSetPDA, findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from '../../helpers';

type ProposeLoanIx = (params: {
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  proposedNftPrice: BN;
  loanToValue: BN;
  isPriceBased: boolean;
}) => Promise<{ loan: web3.Signer, ixs: web3.TransactionInstruction[] }>;

export const proposeLoanIx: ProposeLoanIx = async ({
  proposedNftPrice,
  programId,
  connection,
  user,
  nftMint,
  isPriceBased,
  loanToValue,
  admin,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const loan = web3.Keypair.generate();
  const encoder = new TextEncoder();
  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const nftMetadata = getMetaplexMetadata(nftMint);
  const tokenRecordInfo = findTokenRecordPda(nftMint, nftUserTokenAccount)

  const metadataAccount = await Metadata.fromAccountAddress(connection, nftMetadata);

  const ruleSet = metadataAccount.programmableConfig?.ruleSet;

  const ix = await program.methods.proposeLoan(isPriceBased, proposedNftPrice, loanToValue)
    .accountsStrict({
      loan: loan.publicKey,
      user: user,
      nftUserTokenAccount,
      nftMint: nftMint,
      communityPoolsAuthority,
      instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
      nftMetadata,
      tokenRecordInfo,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      admin,
      editionInfo: editionId,
    }).remainingAccounts(
      [
        {
          pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ],
    ).instruction();

  const ixs: web3.TransactionInstruction[] = []
  ixs.push(web3.ComputeBudgetProgram.requestUnits({
    units: Math.random() * 100000 + 400000,
    additionalFee: 0,
  }))
  ixs.push(ix)

  return { loan: loan, ixs };
};
