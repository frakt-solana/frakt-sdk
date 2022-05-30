import anchor from '@project-serum/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { returnAnchorProgram } from '../../contract_model/accounts';

const initializeCollectionInfo = async (
  programId: PublicKey,
  provider: anchor.Provider,
  liquidityPool: PublicKey,
  admin: PublicKey,
  creatorAddress: PublicKey,
  pricingLookupAddress: PublicKey,
  loanToValue: number | anchor.BN,
  collaterizationRate: number | anchor.BN,
  royaltyAddress: PublicKey,
  royaltyFeeTime: number | anchor.BN,
  royaltyFeePrice: number | anchor.BN,
  expirationTime: number | anchor.BN,
  isPriceBased: boolean,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
): Promise<any> => {
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

export default initializeCollectionInfo;
