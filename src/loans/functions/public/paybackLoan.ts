import { AnchorProvider, web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/src/utils/token';

import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type PaybackLoan = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const paybackLoan: PaybackLoan = async ({
  programId,
  provider,
  user,
  admin,
  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, provider);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const editionId = await Edition.getPDA(nftMint);

  const instruction = program.instruction.paybackLoan(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidityPool: liquidityPool,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      liqOwner,
      communityPoolsAuthority,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
