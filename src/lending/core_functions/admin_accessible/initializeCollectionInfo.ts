import { BN, web3 } from '@project-serum/anchor';

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
  const collectionInfo = web3.Keypair.generate();

  const instruction = await program.instruction.initializeCollectionInfo(
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
        collectionInfo: collectionInfo.publicKey,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, [collectionInfo]);

  return collectionInfo.publicKey;
};
