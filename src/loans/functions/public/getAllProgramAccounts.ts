import { web3 } from '@project-serum/anchor';

import {
  returnAnchorProgram,
  decodedCollectionInfo,
  decodedDeposit,
  decodedLoan,
  decodedPriceBasedLiquidityPool,
  decodedTimeBasedLiquidityPool,
  decodedLendingStake,
  objectBNsAndPubkeysToNums,
} from '../../helpers';
import {
  CollectionInfoView,
  DepositView,
  LoanView,
  PriceBasedLiquidityPoolView,
  TimeBasedLiquidityPoolView,
  LendingStakeView,
  LiquidationLotView,
  LotTicketView,
  NftAttemptView,
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
  lendingStakes: LendingStakeView[];
  liquidationLots: LiquidationLotView[];
}>;

export const getAllProgramAccounts: GetAllProgramAccounts = async (programId, connection) => {
  let program = returnAnchorProgram(programId, connection);

  const collectionInfoRaws = await program.account.collectionInfo.all();
  const depositRaws = await program.account.deposit.all();
  const liquidityPoolRaws = await program.account.liquidityPool.all();
  const priceBasedLiquidityPoolRaws = await program.account.priceBasedLiquidityPool.all();
  const loanRaws = await program.account.loan.all();
  const liquidationLotRaws = await program.account.liquidationLot.all();
  const stakesRaw = await program.account.lendingStake.all();

  const collectionInfos = collectionInfoRaws.map((raw) => decodedCollectionInfo(raw.account, raw.publicKey));
  const deposits = depositRaws.map((raw) => decodedDeposit(raw.account, raw.publicKey));
  const timeBasedLiquidityPools = liquidityPoolRaws.map((raw) => decodedTimeBasedLiquidityPool(raw.account, raw.publicKey));
  const priceBasedLiquidityPools = priceBasedLiquidityPoolRaws.map((raw) => decodedPriceBasedLiquidityPool(raw.account, raw.publicKey));
  const loans = loanRaws.map((raw) => decodedLoan(raw.account, raw.publicKey));
  const lendingStakes = stakesRaw.map((raw) => decodedLendingStake(raw.account, raw.publicKey));

  const liquidationLots = liquidationLotRaws.map(objectBNsAndPubkeysToNums);

  return {
    collectionInfos,
    deposits,
    timeBasedLiquidityPools,
    priceBasedLiquidityPools,
    loans,
    lendingStakes,
    liquidationLots,
  };
};
