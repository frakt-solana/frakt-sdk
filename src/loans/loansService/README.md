# Frakt loans service

## Import

```typescript
import { createLoansService } from '@frakt-protocol/frakt-sdk/lib/loans/loansService';
```

## Usage

Set params and get functions

```typescript
const { fetchBulkSuggestion, proposeLoan, proposeLoans, fetchWalletNfts } = createLoansService({
  apiDomain: DEFAULT_BACKEND_DOMAIN,
  programPublicKey: LOANS_PROGRAM_PUBKEY,
  adminPublicKey: LOANS_FEE_ADMIN_PUBKEY,
});
```

Fetch wallet nfts with necessary data for taking loans

```typescript
const borrowNfts = await fetchWalletNfts({
  walletPublicKey,
});

// Tip: calculate max value available to borrow
const maxBorrowValue = sum(map(borrowNfts, 'maxLoanValue'));
```

Fetch suggestion for bulk loans

```typescript
const suggestion = await fetchBulkSuggestion({
  walletPublicKey,
  totalValue, // F.e. 10 (10 SOL)
});
```

Propose a single loan

```typescript
await proposeLoan({
  nftMint, // pubkey as a string
  valuation, // Valuation of proposed nft (contained in BorrowNft type from fetchWalletNfts)
  ltv, // Loan to value (contained in BorrowNft type from fetchWalletNfts)
  isPriceBased, // is loan flip of perpetual (contained in BorrowNft type from fetchWalletNfts)
  connection, // web3.Connection
  wallet, // Object that implements Wallet interface: {publicKey, signTransaction, signAllTransactions}
});
```

Propose loans bulk

> this function won't work with Ledger (because Ledger doesn't have an implementation of the signAllTransactions method). Please, use the proposeLoan function instead

```typescript
await proposeLoans({
  bulkNfts: suggestion?.[type], // Use one of bulk types from suggestion object from fetchBulkSuggestion func
  connection, // Object that implements Wallet interface: {publicKey, signTransaction, signAllTransactions}
  wallet, // web3.Connection
});
```

## Interfaces

```typescript
interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508 (SOL)
  maxLoanValue: string; // 1.003 (SOL)
  isCanFreeze: boolean; // If false, NFT leaves wallet
  timeBased: {
    // Params for flip loans
    returnPeriodDays: number; // 14 (days)
    ltvPercents: number; // 40 (%)
    fee: string; // 0.100 (SOL)
    feeDiscountPercents: string; // 2 (%)
    repayValue: string; // 1.101 (SOL)
    liquidityPoolPubkey: string;
    loanValue: string; // 1.020 (SOL)
    isCanStake: boolean; // True for collections that support staking (f.e. deGods)
  };
  priceBased?: {
    // Params for perpetual loans (not all collections are supported)
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40 (%)
    borrowAPRPercents: number; // 10 (%)
    collaterizationRate: number; // 10(%)
    isCanStake: boolean; // True for collections that support staking (f.e. deGods)
  };
}
```

```typescript
interface BorrowNftBulk extends BorrowNft {
  solLoanValue: number; // 1.101 (SOL) Suggested loan value
  isPriceBased?: boolean;
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40 (%)
    borrowAPRPercents: number; // 10 (%)
    collaterizationRate: number; // 10(%)
    isCanStake: boolean; // True for collections that support staking (f.e. deGods)
    ltv?: number;
    suggestedLoanValue?: number;
  };
}
```
