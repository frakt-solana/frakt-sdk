import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';

export async function initializeCollectionInfo({
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
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  admin: PublicKey;
  creatorAddress: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const collectionInfo = Keypair.generate();

  const ix = await program.instruction.initializeCollectionInfo(
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

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction, [collectionInfo]);
  return collectionInfo.publicKey;
}
