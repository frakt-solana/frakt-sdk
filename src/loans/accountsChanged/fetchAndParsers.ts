import { Connection, PublicKey } from '@solana/web3.js';
import {
  CollectionInfoView,
  DepositView,
  LiquidationLotView,
  LoanView,
  PriceBasedLiquidityPoolView,
  TimeBasedLiquidityPoolView
} from '../types';
import {
  objectBNsAndPubkeysToNums,
  returnAnchorProgram,
  decodedCollectionInfo,
  decodedDeposit,
  decodedLoan,
  decodedTimeBasedLiquidityPool,
  decodedPriceBasedLiquidityPool
} from "../helpers"

export const fetchAndParseLiquidationLot = async ({
  liquidationLotPubkey,
  programId,
  connection,
}: {
  liquidationLotPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<LiquidationLotView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  const liquidationLotRaw = await nftLendingProgram.account.liquidationLot.fetch(liquidationLotPubkey, 'confirmed');

  const liquidationLot = objectBNsAndPubkeysToNums({
    account: liquidationLotRaw,
    publicKey: liquidationLotPubkey,
  });
  return liquidationLot;
};

export const fetchAndParseDeposit = async ({
  depositPubkey,
  programId,
  connection,
}: {
  depositPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<DepositView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  const depositRaw = await nftLendingProgram.account.deposit.fetch(depositPubkey, 'confirmed');

  const deposit = decodedDeposit(depositRaw, depositPubkey);
  return deposit;
};

export const fetchAndParseLoan = async ({
  loanPubkey,
  programId,
  connection,
}: {
  loanPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<LoanView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  const loanRaw = await nftLendingProgram.account.loan.fetch(loanPubkey, 'confirmed');

  const loan = decodedLoan(loanRaw, loanPubkey);
  return loan;
};

export const fetchAndParseTimeBasedLiquidityPool = async ({
  timeBasedLiquidityPoolPubkey,
  programId,
  connection,
}: {
  timeBasedLiquidityPoolPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<TimeBasedLiquidityPoolView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  const liquidityPoolRaw = await nftLendingProgram.account.liquidityPool.fetch(
    timeBasedLiquidityPoolPubkey,
    'confirmed',
  );

  const liquidityPool = decodedTimeBasedLiquidityPool(liquidityPoolRaw, timeBasedLiquidityPoolPubkey);
  return liquidityPool;
};

export const fetchAndParsePriceBasedLiquidityPool = async ({
  priceBasedLiquidityPoolPubkey,
  programId,
  connection,
}: {
  priceBasedLiquidityPoolPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<PriceBasedLiquidityPoolView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  const liquidityPoolRaw = await nftLendingProgram.account.priceBasedLiquidityPool.fetch(
    priceBasedLiquidityPoolPubkey,
    'confirmed',
  );

  const liquidityPool = decodedPriceBasedLiquidityPool(liquidityPoolRaw, priceBasedLiquidityPoolPubkey);
  return liquidityPool;
};

export const fetchAndParseCollectionInfo = async ({
  collectionInfoPubkey,
  programId,
  connection,
}: {
  collectionInfoPubkey: PublicKey;
  programId: PublicKey;
  connection: Connection;
}): Promise<CollectionInfoView> => {
  const nftLendingProgram = returnAnchorProgram(programId, connection);
  // should be confirmed everywhere
  const collectionInfoRaw = await nftLendingProgram.account.collectionInfo.fetch(collectionInfoPubkey, 'confirmed');

  const collectionInfo = decodedCollectionInfo(collectionInfoRaw, collectionInfoPubkey);
  return collectionInfo;
};
