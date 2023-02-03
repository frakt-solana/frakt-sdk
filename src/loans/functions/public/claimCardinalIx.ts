import { web3, utils } from '@project-serum/anchor';
import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type ClaimCardinalIx = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  payer: web3.PublicKey;
  user: web3.PublicKey;
  cardinalRewardsCenter:web3. PublicKey;
  nftMint: web3.PublicKey;
  rewardDistributor: web3.PublicKey;
  stakePool: web3.PublicKey;
  loan: web3.PublicKey;
  claimRewardsPaymentInfo: web3.PublicKey;
  rewardMint: web3.PublicKey;
  paymentPubkey1: web3.PublicKey;
  paymentPubkey2: web3.PublicKey;
}) => Promise<{claimIx: web3.TransactionInstruction}>;

export const claimCardinalIx: ClaimCardinalIx = async ({
  programId,
  connection,
  user,
  payer,
  cardinalRewardsCenter,
  nftMint,
  stakePool,
  rewardDistributor,
  loan,
  rewardMint,
  claimRewardsPaymentInfo,
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
  const [rewardEntry] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('reward-entry'), rewardDistributor.toBuffer(), stakeEntry.toBuffer(), ],
    cardinalRewardsCenter,
  );

  const tokenDestinationIdentity = await findAssociatedTokenAddress(identity, rewardMint);
  const rewardDestination = await findAssociatedTokenAddress(user, rewardMint);
  const rewardDistributorTokenAccount = await findAssociatedTokenAddress(rewardDistributor, rewardMint);
  // const additionalComputeBudgetInstruction = ComputeBudgetProgram.requestUnits({
  //   units: 300000,
  //   additionalFee: 0,
  // });
  

  const claimIx = await program.methods.claimCardinal().accounts({
        user,
        identity,
        rewardMint,
        payer: payer,
        cardinalStakeCenter: cardinalRewardsCenter,
        rewardDistributor,
        rewardDistributorTokenAccount,
        rewardEntry,
        stakeEntry,
        stakePool,
        rewardDestination,
        loan,
        lendingStake,
        tokenDestinationIdentity,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      }).remainingAccounts([
        {
          pubkey: claimRewardsPaymentInfo,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: payer,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: paymentPubkey1,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: paymentPubkey2,
          isSigner: false,
          isWritable: true,
        },
      ]).instruction()

  return {claimIx};
};
