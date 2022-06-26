import { AnchorProvider, BN, web3 } from '@project-serum/anchor';

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
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;

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
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const collectionInfo = web3.Keypair.generate();

  const instruction = program.instruction.initializeCollectionInfo(
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
