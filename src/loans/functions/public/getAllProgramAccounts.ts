import { AnchorProvider, web3 } from '@project-serum/anchor';

import { createFakeWallet } from '../../../common';
import {
  returnAnchorProgram,
  decodedCollectionInfo,
  decodedDeposit,
  decodedLoan,
  decodedPriceBasedLiquidityPool,
  decodedTimeBasedLiquidityPool,
} from '../../helpers';
import {
  CollectionInfoView,
  DepositView,
  LoanView,
  PriceBasedLiquidityPoolView,
  TimeBasedLiquidityPoolView,
} from '../../types';

type GetAllProgramAccounts = (
  programId: web3.PublicKey,
  connection: web3.Connection,
) => Promise<{
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  timeBasedLiquidityPools: TimeBasedLiquidityPoolView[];
  priceBasedLiquidityPools: PriceBasedLiquidityPoolView[];
  loans: LoanView[];
}>;

export const getAllProgramAccounts: GetAllProgramAccounts = async (programId, connection) => {
  const provider = new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions());
  let program = returnAnchorProgram(programId, connection);

  const collectionInfoRaws = await program.account.collectionInfo.all();
  const depositRaws = await program.account.deposit.all();
  const liquidityPoolRaws = await program.account.liquidityPool.all();
  const priceBasedLiquidityPoolRaws = await program.account.priceBasedLiquidityPool.all();
  const loanRaws = await program.account.loan.all();

  const collectionInfos = collectionInfoRaws.map((raw) => decodedCollectionInfo(raw.account, raw.publicKey));
  const deposits = depositRaws.map((raw) => decodedDeposit(raw.account, raw.publicKey));
  const timeBasedLiquidityPools = liquidityPoolRaws.map((raw) =>
    decodedTimeBasedLiquidityPool(raw.account, raw.publicKey),
  );
  const priceBasedLiquidityPools = priceBasedLiquidityPoolRaws.map((raw) =>
    decodedPriceBasedLiquidityPool(raw.account, raw.publicKey),
  );
  const loans = loanRaws.map((raw) => decodedLoan(raw.account, raw.publicKey));

  // return { collectionInfos, deposits, liquidityPools, loans };
  return { collectionInfos, deposits, timeBasedLiquidityPools, priceBasedLiquidityPools, loans };
};
