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
