import { AnchorProvider, BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UpdateCollectionInfo = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
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
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const updateCollectionInfo: UpdateCollectionInfo = async ({
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
}) => {
  const program = returnAnchorProgram(programId, provider);

  const instruction = program.instruction.updateCollectionInfo(
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
