import { BN, web3 } from '@project-serum/anchor';

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
      loanToValue: new BN(loanToValue),
      collaterizationRate: new BN(collaterizationRate),
      royaltyFeeTime: new BN(royaltyFeeTime),
      royaltyFeePrice: new BN(royaltyFeePrice),
      expirationTime: new BN(expirationTime),
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

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
