import { BN, web3 } from '@project-serum/anchor';
import { chunk } from 'lodash';
import { Wallet } from '../../common/classes/nodewallet';

import { SOL_TOKEN } from '../../common/constants';
import { proposeLoanIx } from '../functions/public/proposeLoan';
import { PROPOSE_LOAN_IXS_PER_TXN } from './constants';
import { BorrowNftBulk, ProposeLoan, ProposeLoans } from './types';

interface TxnAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

type CreateProposeLoansTxns = (props: {
  programPublicKey: web3.PublicKey;
  adminPublicKey: web3.PublicKey;
  connection: web3.Connection;
  walletPublicKey: web3.PublicKey;
  bulkNfts: BorrowNftBulk[];
}) => Promise<TxnAndSigners[]>;
const createProposeLoansTxns: CreateProposeLoansTxns = async ({
  programPublicKey,
  adminPublicKey,
  connection,
  walletPublicKey,
  bulkNfts,
}) => {
  const ixnsAndSigners = await Promise.all(
    bulkNfts.map(async (bulkNft) => {
      const { mint, valuation, isPriceBased, priceBased, solLoanValue } = bulkNft;

      const valuationNumber = parseFloat(valuation);

      const suggestedLoanValue = priceBased?.suggestedLoanValue || 0;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;

      const rawLoanToValue = (solLoanValue / valuationNumber) * 100;

      const proposedNftPrice = valuationNumber * 10 ** SOL_TOKEN.decimals;

      const loanToValue = rawLoanToValue || suggestedLtvPersent;

      const { ix, loan } = await proposeLoanIx({
        programId: programPublicKey,
        connection,
        user: walletPublicKey,
        nftMint: new web3.PublicKey(mint),
        proposedNftPrice: new BN(proposedNftPrice),
        isPriceBased: !!isPriceBased,
        loanToValue: new BN(loanToValue * 100),
        admin: adminPublicKey,
      });

      return {
        instruction: ix,
        signer: loan,
      };
    }),
  );

  const txnsAndSigners = chunk(ixnsAndSigners, PROPOSE_LOAN_IXS_PER_TXN).map((ixnsAndSigners) => ({
    transaction: new web3.Transaction().add(...ixnsAndSigners.map(({ instruction }) => instruction)),
    signers: ixnsAndSigners.map(({ signer }) => signer),
  }));

  return txnsAndSigners;
};

type CreateProposeLoanTxn = (props: {
  programPublicKey: web3.PublicKey;
  adminPublicKey: web3.PublicKey;
  connection: web3.Connection;
  walletPublicKey: web3.PublicKey;
  nftMint: string;
  valuation: number;
  ltv: number;
  isPriceBased?: boolean;
}) => Promise<TxnAndSigners>;
const createProposeLoanTxn: CreateProposeLoanTxn = async ({
  programPublicKey,
  adminPublicKey,
  connection,
  walletPublicKey,
  nftMint,
  valuation,
  ltv,
  isPriceBased = false,
}) => {
  const { ix, loan } = await proposeLoanIx({
    programId: new web3.PublicKey(programPublicKey),
    connection,
    user: walletPublicKey,
    nftMint: new web3.PublicKey(nftMint),
    proposedNftPrice: new BN(valuation * 10 ** SOL_TOKEN.decimals),
    isPriceBased,
    loanToValue: new BN(ltv * 100), //? Percent 20% ==> 2000
    admin: new web3.PublicKey(adminPublicKey),
  });

  return {
    transaction: new web3.Transaction().add(ix),
    signers: [loan],
  };
};

export type SignAndSendTransaction = (props: {
  txnAndSigners: TxnAndSigners;
  connection: web3.Connection;
  wallet: Wallet;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
}) => Promise<web3.RpcResponseAndContext<web3.SignatureResult>>;
const signAndSendTransaction: SignAndSendTransaction = async ({
  txnAndSigners,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
}) => {
  onBeforeApprove?.();

  const { transaction } = txnAndSigners;

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  if (txnAndSigners?.signers?.length) {
    transaction.sign(...txnAndSigners.signers);
  }

  const signedTransaction = await wallet.signTransaction(transaction);

  const signature = await connection.sendRawTransaction(signedTransaction.serialize(), { skipPreflight: false });

  onAfterSend?.();

  return await connection.confirmTransaction(
    {
      signature,
      blockhash,
      lastValidBlockHeight,
    },
    commitment,
  );
};

export type SignAndSendAllTransactions = (props: {
  txnAndSignersArray: TxnAndSigners[];
  connection: web3.Connection;
  wallet: Wallet;
  commitment?: web3.Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
}) => Promise<PromiseSettledResult<web3.RpcResponseAndContext<web3.SignatureResult>>[]>;
const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  txnAndSignersArray,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
}) => {
  onBeforeApprove?.();

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const transactions = txnAndSignersArray.map(({ transaction, signers = [] }) => {
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    if (signers.length) {
      transaction.sign(...signers);
    }

    return transaction;
  });

  const signedTransactions = await wallet.signAllTransactions(transactions);

  const txnSignatures = await Promise.all(
    signedTransactions.map((txn) =>
      connection.sendRawTransaction(txn.serialize(), {
        skipPreflight: false,
      }),
    ),
  );

  onAfterSend?.();

  return await Promise.allSettled(
    txnSignatures.map((signature) =>
      connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        commitment,
      ),
    ),
  );
};

type CreateProposeLoans = (props: { programPublicKey: string; adminPublicKey: string }) => ProposeLoans;
export const createProposeLoans: CreateProposeLoans =
  ({ programPublicKey, adminPublicKey }) =>
  async ({ bulkNfts, connection, wallet, onAfterSend, onBeforeApprove }) => {
    const txnAndSignersArray = await createProposeLoansTxns({
      programPublicKey: new web3.PublicKey(programPublicKey),
      adminPublicKey: new web3.PublicKey(adminPublicKey),
      connection,
      walletPublicKey: wallet.publicKey,
      bulkNfts,
    });

    return await signAndSendAllTransactions({
      txnAndSignersArray,
      connection,
      wallet,
      onAfterSend,
      onBeforeApprove,
    });
  };

type CreateProposeLoan = (props: { programPublicKey: string; adminPublicKey: string }) => ProposeLoan;
export const createProposeLoan: CreateProposeLoan =
  ({ programPublicKey, adminPublicKey }) =>
  async ({ connection, wallet, nftMint, valuation, ltv, isPriceBased, onAfterSend, onBeforeApprove }) => {
    const txnAndSigners = await createProposeLoanTxn({
      programPublicKey: new web3.PublicKey(programPublicKey),
      adminPublicKey: new web3.PublicKey(adminPublicKey),
      connection,
      walletPublicKey: wallet.publicKey,
      nftMint,
      valuation,
      ltv,
      isPriceBased,
    });

    return await signAndSendTransaction({
      txnAndSigners,
      connection,
      wallet,
      onAfterSend,
      onBeforeApprove,
    });
  };
