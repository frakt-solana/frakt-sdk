import { web3, utils, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type PutLoanToLiquidationRaffles = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  gracePeriod: number;

  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;

export const putLoanToLiquidationRaffles: PutLoanToLiquidationRaffles = async ({
  programId,
  connection,
  admin,
  loan,
  nftMint,
  gracePeriod,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);
  const nftAdminTokenAccount = await findAssociatedTokenAddress(admin, nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const liquidationLotAccount = web3.Keypair.generate();

  const instruction = program.instruction.putLoanToLiquidationRaffles(bumpPoolsAuth, new BN(gracePeriod), {
    accounts: {
      loan: loan,
      liquidationLot: liquidationLotAccount.publicKey,
      admin: admin,
      nftMint: nftMint,
      vaultNftTokenAccount: vaultNftTokenAccount,
      nftAdminTokenAccount: nftAdminTokenAccount,
      communityPoolsAuthority,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
    },
  });

  const transaction = new web3.Transaction().add(instruction);
  await sendTxn(transaction, [liquidationLotAccount]);
  return liquidationLotAccount.publicKey;
};
