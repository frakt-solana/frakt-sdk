import {
  CollectionInfoView,
  DepositView,
  LiquidationLotView,
  LoanView,
  PriceBasedLiquidityPoolView,
  TimeBasedLiquidityPoolView
} from '../types';
import { PublicKey, Connection, ParsedTransactionWithMeta } from '@solana/web3.js';
import { TRANSACTION_ACCOUNT_PARSERS } from './transactionParsers';

export interface AccountsChanged {
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  timeBasedLiquidityPools: TimeBasedLiquidityPoolView[];
  priceBasedLiquidityPools: PriceBasedLiquidityPoolView[];
  loans: LoanView[];
  liquidationLots: LiquidationLotView[];
}
export interface TransactionAccountParserParams {
  transaction: ParsedTransactionWithMeta;
  programId: PublicKey;
  connection: Connection;
}
// Proposed,
// Rejected,
// Activated,
// PaidBack,
// Liquidated,
// PaidBackWithGrace,

export const LOAN_STATE_PRIORITY = {
  proposed: 0,
  rejected: 1,
  activated: 2,
  paidBack: 3,
  liquidated: 4,
  paidBackWithGrace: 5,
};

export const onAccountsChange = async ({
  programId,
  timeoutOfCalls,
  fromThisSignature,
  connection,
  onAccountsChange,
}: {
  programId: PublicKey;
  timeoutOfCalls?: number;
  fromThisSignature?: string;
  connection: Connection;
  onAccountsChange: (changedAccounts: AccountsChanged, functionName?: string) => Promise<any>;
}) => {
  console.log('onAccountsChange');
  let lastSignature =
    fromThisSignature ||
    (
      await connection.getSignaturesForAddress(
        programId,
        {
          limit: 1,
        },
        'confirmed',
      )
    )[0].signature;
  while (true) {
    try {
      // console.log('args: ', {
      //   limit: 50,
      //   until: lastSignature,
      // });
      // const latestConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(programId, {
      //   limit: 1,
      // });
      // if (!latestConfirmedSignatures[0]) continue;

      // lastSignature = latestConfirmedSignatures[0].signature;
      if (!lastSignature) {
        const latestConfirmedSignatures = await connection.getSignaturesForAddress(
          programId,
          {
            limit: 1,
          },
          'confirmed',
        );
        if (!latestConfirmedSignatures[0]) {
          await new Promise((f) => setTimeout(f, 200));
          continue;
        }
        lastSignature = latestConfirmedSignatures[0].signature;
      }

      // console.log('args: ', {
      //   limit: 50,
      //   until: lastSignature,
      // });
      const newSignatureInfos = await connection.getSignaturesForAddress(
        programId,
        {
          limit: 50,
          until: lastSignature,
        },
        'confirmed',
      );
      // console.log('result: ', newSignatureInfos.length);
      if (!newSignatureInfos) {
        await new Promise((f) => setTimeout(f, 200));
        continue;
      }
      if (newSignatureInfos.length > 10) {
        console.log('more than 10 signatures error: ', newSignatureInfos.length);
        const latestConfirmedSignatures = await connection.getSignaturesForAddress(
          programId,
          {
            limit: 1,
          },
          'confirmed',
        );
        if (!latestConfirmedSignatures[0]) continue;
        lastSignature = latestConfirmedSignatures[0].signature;
        await new Promise((f) => setTimeout(f, 200));
        continue;
      }
      // console.log('result: ', newSignatureInfos);
      for (let signatureInfo of [...newSignatureInfos].reverse()) {
        await new Promise((f) => setTimeout(f, 100));
        const currentTransactionInfo: any = await connection.getParsedTransaction(signatureInfo.signature, 'confirmed');
        if (!currentTransactionInfo) {
          // const latestConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(programId, {
          //   limit: 1,
          // });
          // if (!latestConfirmedSignatures[0]) continue;
          // await new Promise((f) => setTimeout(f, 100));
          lastSignature = signatureInfo.signature;
          await new Promise((f) => setTimeout(f, 100));
          continue;
        }
        if (!currentTransactionInfo.meta) {
          // lastSignature = signatureInfo.signature;
          // const latestConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(programId, {
          //   limit: 1,
          // });
          // if (!latestConfirmedSignatures[0]) continue;
          lastSignature = signatureInfo.signature;
          await new Promise((f) => setTimeout(f, 100));
          continue;
        }
        const instructionLog = currentTransactionInfo.meta.logMessages[1]
          != "Program ComputeBudget111111111111111111111111111111 success" ?
          currentTransactionInfo.meta.logMessages[1] : currentTransactionInfo.meta.logMessages[3];
        if (TRANSACTION_ACCOUNT_PARSERS[instructionLog]) {
          try {
            onAccountsChange(
              await TRANSACTION_ACCOUNT_PARSERS[instructionLog]({
                transaction: currentTransactionInfo,
                programId: programId,
                connection: connection,
              }),
              instructionLog,
            );
            lastSignature = signatureInfo.signature;
          } catch (err) {
            // const latestConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(programId, {
            //   limit: 1,
            // });
            // if (!latestConfirmedSignatures[0]) continue;
            lastSignature = signatureInfo.signature;
            console.log('onAccountsChange Error in ', instructionLog, ': ', err);
            await new Promise((f) => setTimeout(f, 100));
            continue;
          }
        }
      }
    } catch (err) {
      const latestConfirmedSignatures = await connection.getSignaturesForAddress(
        programId,
        {
          limit: 1,
        },
        'confirmed',
      );

      if (!latestConfirmedSignatures[0]) continue;
      lastSignature = latestConfirmedSignatures[0].signature;

      console.log('onAccountsChange Error: ', err);
    }
    await new Promise((f) => setTimeout(f, timeoutOfCalls || 5000));
  }
};
