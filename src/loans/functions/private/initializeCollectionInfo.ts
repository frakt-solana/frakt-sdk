import { BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type InitializeCollectionInfo = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidityPool: web3.PublicKey;
  admin: web3.PublicKey;
  creatorAddress: web3.PublicKey;
  pricingLookupAddress: web3.PublicKey;
  loanToValue: number | BN;
  collaterizationRate: number | BN;
  royaltyAddress: web3.PublicKey;
  royaltyFeeTime: number | BN;
  royaltyFeePrice: number | BN;
  expirationTime: number | BN;
  isPriceBased: boolean;
}) => Promise<{ix: web3.TransactionInstruction, collectionInfo: web3.Signer}>;

export const initializeCollectionInfo: InitializeCollectionInfo = async ({
  programId,
  connection,
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
}) => {
  const program = returnAnchorProgram(programId, connection);
  const collectionInfo = web3.Keypair.generate();

  const instruction = await program.methods.initializeCollectionInfo(
    {
      loanToValue: new BN(loanToValue),
      collaterizationRate: new BN(collaterizationRate),
      royaltyFeeTime: new BN(royaltyFeeTime),
      royaltyFeePrice: new BN(royaltyFeePrice),
      expirationTime: new BN(expirationTime),
      isPriceBased,
    }).accounts({
        liquidityPool: liquidityPool,
        collectionInfo: collectionInfo.publicKey,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
  ).instruction();

  return {ix: instruction, collectionInfo};
};
