import * as anchor from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';

import { UpdateCollectionInfo } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const updateCollectionInfo = async (params: UpdateCollectionInfo): Promise<any> => {
  const {
    programId,
    provider,
    liquidityPool,
    admin,
    creatorAddress,
    collectionInfo,
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

  const instruction = await program.instruction.updateCollectionInfo(
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
        collectionInfo: collectionInfo,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
      },
    },
  );

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};
