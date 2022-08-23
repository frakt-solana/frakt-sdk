import { BN, web3, utils } from '@project-serum/anchor';
import { METADATA_PREFIX, METADATA_PROGRAM_PUBKEY } from '../../constants';

import { returnAnchorProgram, getMetaplexEditionPda } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type StakeGemFarm = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  gemFarm: web3.PublicKey;
  gemBank: web3.PublicKey;
  farm: web3.PublicKey;
  bank: web3.PublicKey;
  feeAcc: web3.PublicKey;
  nftMint: web3.PublicKey;
  loan: web3.PublicKey;
  isDegod: boolean;
  creatorWhitelistProof: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const stakeGemFarm: StakeGemFarm = async ({
  programId,
  connection,
  user,
  gemFarm,
  gemBank,
  farm,
  bank,
  feeAcc,
  nftMint,
  loan, 
  isDegod,
  creatorWhitelistProof,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const [identity, bumpAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('degod_stake'), nftMint.toBuffer(), loan.toBuffer()],
    programId,
  );
  const editionId = getMetaplexEditionPda(nftMint);

  const [farmer, bumpFarmer] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('farmer'), farm.toBuffer(), identity.toBuffer()],
    gemFarm,
  );

  const [lendingStake] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('stake_acc'), loan.toBuffer()],
    programId,
  );

  const [vault, bumpVault] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vault'), bank.toBuffer(), identity.toBuffer()],
    gemBank,
  );

  const [bankAuthority, bumpAuthVaultAuthority] = await web3.PublicKey.findProgramAddress(
    [vault.toBuffer()],
    gemBank,
  );

  const [gemBox, bumpGemBox] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('gem_box'), vault.toBuffer(), nftMint.toBuffer()],
    gemBank,
  );

  const [gemDepositReceipt, bumpGdr] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('gem_deposit_receipt'), vault.toBuffer(), nftMint.toBuffer()],
    gemBank,
  );

  const [gemRarity, bumpRarity] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('gem_rarity'), bank.toBuffer(), nftMint.toBuffer()],
    gemBank,
  );

  const [farmAuthority] = await web3.PublicKey.findProgramAddress(
    [farm.toBuffer()],
    gemFarm,
  );
  const [gemMetadata] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from(METADATA_PREFIX),
      METADATA_PROGRAM_PUBKEY.toBuffer(),
      new web3.PublicKey(nftMint).toBuffer(),
    ],
    METADATA_PROGRAM_PUBKEY,
  );
  const [mintWhitelistProof] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("whitelist"), bank.toBuffer(), nftMint.toBuffer()],
    gemBank
  );
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);  

  const ix = program.instruction.stakeGemFarmStaking({
    bumpPoolsAuth,
    bumpAuth,
    bumpAuthVaultAuthority,
    bumpRarity,
    bumpGdr,
    bumpGemBox,
    isDegod,
    bumpVault,
    bumpFarmer,
    },
    {
      accounts: {
        user,
        gemFarm,
        farm,
        farmAuthority,
        lendingStake,
        farmer,
        loan, 
        identity,
        bank,
        gemBank,
        feeAcc,
        vault,
        authority:bankAuthority,
        gemBox,
        gemDepositReceipt,
        gemSource: nftUserTokenAccount,
        gemMint: nftMint,
        gemRarity,
        communityPoolsAuthority,
        metadataProgram: METADATA_PROGRAM_PUBKEY,
        editionInfo: editionId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      },
      remainingAccounts:[
        {
          pubkey: mintWhitelistProof,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: gemMetadata,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: creatorWhitelistProof,
          isSigner: false,
          isWritable: false,
        },
      ]
    }
  )
  const additionalComputeBudgetInstruction = web3.ComputeBudgetProgram.requestUnits({
    units: 400000,
    additionalFee: 0,
  });
  const transaction = new web3.Transaction().add(additionalComputeBudgetInstruction).add(ix);

  await sendTxn(transaction);
};
