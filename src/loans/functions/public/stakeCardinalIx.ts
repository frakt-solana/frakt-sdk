import { web3, utils } from '@project-serum/anchor';
import { METADATA_PREFIX, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { returnAnchorProgram, getMetaplexEditionPda } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type StakeCardinalParams = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  payer: web3.PublicKey;
  cardinalRewardsCenter: web3.PublicKey;
  nftMint: web3.PublicKey;
  stakePool: web3.PublicKey;
  loan: web3.PublicKey;
  stakeRewardsPaymentInfo: web3.PublicKey;
  rewardMint: web3.PublicKey;
  paymentPubkey1: web3.PublicKey;
  paymentPubkey2: web3.PublicKey;
}) => Promise<{additionalComputeBudgetInstructionIx: web3.TransactionInstruction, stakeIx: web3.TransactionInstruction}>;

export const stakeCardinalIx: StakeCardinalParams = async ({
  programId,
  connection,
  user,
  payer,
  cardinalRewardsCenter,
  nftMint,
  stakePool,
  loan,
  rewardMint,
  stakeRewardsPaymentInfo,
  paymentPubkey1,
  paymentPubkey2,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [identity, bumpAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('degod_cardinal'), user.toBuffer()],
    programId,
  );

  const [lendingStake] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('stake_acc'), loan.toBuffer()],
    programId,
  );

  const [stakeEntry] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('stake-entry'), stakePool.toBuffer(), nftMint.toBuffer(), web3.PublicKey.default.toBuffer()],
    cardinalRewardsCenter,
  );

  const [identityEscrow] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('escrow'), identity.toBuffer()],
    cardinalRewardsCenter,
  );
  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const [nftMintMetadata] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('metadata'), METADATA_PROGRAM_PUBKEY.toBuffer(), nftMint.toBuffer()],
    METADATA_PROGRAM_PUBKEY,
  );

  const payerTokenAccount = await findAssociatedTokenAddress(payer, rewardMint);
  const reward1TokenAccount = await findAssociatedTokenAddress(paymentPubkey1, rewardMint);
  const reward2TokenAccount = await findAssociatedTokenAddress(paymentPubkey2, rewardMint);

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const identityStakeMintTokenAccount = await findAssociatedTokenAddress(identity, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const additionalComputeBudgetInstructionIx = web3.ComputeBudgetProgram.requestUnits({
    units: 400000,
    additionalFee: 0,
  });
  

  const stakeIx = await program.methods.stakeCardinal().accounts({
        user,
        lendingStake,
        loan, 
        stakeMint: nftMint,
        nftUserTokenAccount,
        identity,
        identityStakeMintTokenAccount,

        payer,
        cardinalStakeCenter: cardinalRewardsCenter,
        stakeEntry,
        stakePool,
        identityEscrow,
        communityPoolsAuthority,
        stakeMintMetadata: nftMintMetadata,

        editionInfo: editionId,
        metadataProgram: METADATA_PROGRAM_PUBKEY,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      },
  ).remainingAccounts(
    [
      {
        pubkey: stakeRewardsPaymentInfo,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: utils.token.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: payerTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: reward1TokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: reward2TokenAccount,
        isSigner: false,
        isWritable: true,
      },
    ]
  ).instruction()
  return {additionalComputeBudgetInstructionIx, stakeIx}
};
