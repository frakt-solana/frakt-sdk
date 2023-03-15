import { BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UpdateCollectionInfo = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidityPool: web3.PublicKey;
  admin: web3.PublicKey;
  creatorAddress: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  pricingLookupAddress: web3.PublicKey;
  loanToValue: number | BN;
  collaterizationRate: number | BN;
  royaltyAddress: web3.PublicKey;
  royaltyFeeTime: number | BN;
  royaltyFeePrice: number | BN;
  expirationTime: number | BN;
  isPriceBased: boolean;
}) => Promise<{ix: web3.TransactionInstruction}>;

export const updateCollectionInfo: UpdateCollectionInfo = async ({
  programId,
  connection,
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
}) => {
  const program = returnAnchorProgram(programId, connection);

  const ix = await program.methods.updateCollectionInfo(
    {
      loanToValue: new BN(loanToValue),
      collaterizationRate: new BN(collaterizationRate),
      royaltyFeeTime: new BN(royaltyFeeTime),
      royaltyFeePrice: new BN(royaltyFeePrice),
      expirationTime: new BN(expirationTime),
      isPriceBased,
    }).accountsStrict({
        liquidityPool: liquidityPool,
        collectionInfo: collectionInfo,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
      }).instruction();

  return {ix}
};
