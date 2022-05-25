import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from '../../contract_model/accounts';
import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from '../../contract_model/accounts';

export async function updateCollectionInfo({
  programId,
  provider,
  liquidityPool,
  admin,
  creatorAddress,
  pricingLookupAddress,
  loanToValue,
  collaterizationRate,
  royaltyAddress,
  collectionInfo,
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
  collectionInfo: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const ix = await program.instruction.updateCollectionInfo(
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

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
