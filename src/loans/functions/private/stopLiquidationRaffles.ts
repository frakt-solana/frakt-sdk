import { web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';

import { returnAnchorProgram } from '../../helpers';

type RevealLotTicketByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidationLot: web3.PublicKey;
  loan: web3.PublicKey;

  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

// pub loan: Box<Account<'info, Loan>>,

// pub liquidation_lot: Box<Account<'info, LiquidationLot>>,

// pub admin: Signer<'info>,

// pub nft_mint: Account<'info, Mint>,

// pub vault_nft_token_account: Box<Account<'info, TokenAccount>>,

// pub nft_admin_token_account: Box<Account<'info, TokenAccount>>,

// pub community_pools_authority: AccountInfo<'info>,

// pub token_program: Program<'info, Token>,

// pub associated_token_program: Program<'info, AssociatedToken>,
// pub system_program: Program<'info, System>,

// pub rent: Sysvar<'info, Rent>,

export const stopLiquidationRaffles: RevealLotTicketByAdmin = async ({
  programId,
  connection,
  admin,
  nftMint,
  liquidationLot,
  loan,
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

  const ix = program.instruction.stopLiquidationRafflesByAdmin(bumpPoolsAuth, {
    accounts: {
      admin,
      nftMint,
      communityPoolsAuthority,
      liquidationLot,
      loan,
      vaultNftTokenAccount,
      nftAdminTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
  });
  const transaction = new web3.Transaction().add(ix);

  await sendTxn(transaction);
};
