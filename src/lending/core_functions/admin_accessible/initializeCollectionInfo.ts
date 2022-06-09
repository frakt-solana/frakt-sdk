import * as anchor from '@project-serum/anchor';
import { Keypair, Transaction } from '@solana/web3.js';

import { InitializeCollectionInfo } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const initializeCollectionInfo = async (params: InitializeCollectionInfo): Promise<any> => {
  const {
    programId,
    provider,
    liquidityPool,
    admin,
    creatorAddress,
    pricingLookupAddress,
    loanToValue,
    collaterizationRate,
    royaltyAddress,
    royaltyFeeTime,
    royaltyFeePrice,
    expirationTime,
    isPriceBased,
    sendTxn,
  } = params;

  const program = await returnAnchorProgram(programId, provider);
  const collectionInfo = Keypair.generate();

  const instruction = await program.instruction.initializeCollectionInfo(
    {
      loanToValue: new anchor.BN(loanToValue),
      collaterizationRate: new anchor.BN(collaterizationRate),
      royaltyFeeTime: new anchor.BN(royaltyFeeTime),
      royaltyFeePrice: new anchor.BN(royaltyFeePrice),
      expirationTime: new anchor.BN(expirationTime),
      isPriceBased,
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        collectionInfo: collectionInfo.publicKey,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, [collectionInfo]);

  return collectionInfo.publicKey;
};
