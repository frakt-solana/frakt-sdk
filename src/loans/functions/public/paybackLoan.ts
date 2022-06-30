import { AnchorProvider, web3, utils, BN } from '@project-serum/anchor';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

type PaybackLoan = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
  paybackAmount: BN;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const paybackLoan: PaybackLoan = async ({
  programId,
  connection,
  user,
  admin,
  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
  paybackAmount,
  sendTxn,
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

  const instruction = program.instruction.paybackLoan(bumpPoolsAuth, paybackAmount, {
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
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
    },
  });

  // program.instruction.paybackLoan(bumpPoolsAuth, {
  //   accounts: {
  //     loan: loan,
  //     liquidityPool: liquidityPool,
  //     collectionInfo,
  //     user: user,
  //     admin,
  //     nftMint: nftMint,
  //     nftUserTokenAccount: nftUserTokenAccount,
  //     royaltyAddress,
  //     liqOwner,
  //     communityPoolsAuthority,
  //     systemProgram: web3.SystemProgram.programId,
  //     tokenProgram: utils.token.TOKEN_PROGRAM_ID,
  //     // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //     metadataProgram: METADATA_PROGRAM_PUBKEY,
  //     editionInfo: editionId,
  //   },
  // });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
