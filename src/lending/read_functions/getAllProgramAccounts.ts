import { AnchorProvider, web3 } from '@project-serum/anchor';
import {
  returnAnchorProgram,
  decodedCollectionInfo,
  decodedDeposit,
  decodedLiquidityPool,
  decodedLoan,
} from '../contract_model/accounts';
import { createFakeWallet } from '../../common';
import { CollectionInfoView, DepositView, LiquidityPoolView, LoanView } from '../../common/types';

interface IReturn {
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPools: LiquidityPoolView[];
  loans: LoanView[];
}

export const getAllProgramAccounts = async (programId: web3.PublicKey, connection: web3.Connection): Promise<IReturn> => {
  const provider = new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions());
  const program = returnAnchorProgram(programId, provider);

  const collectionInfoRaws = await program.account.collectionInfo.all();
  const depositRaws = await program.account.deposit.all();
  const liquidityPoolRaws = await program.account.liquidityPool.all();
  const loanRaws = await program.account.loan.all();

  const collectionInfos = collectionInfoRaws.map((raw) => decodedCollectionInfo(raw.account, raw.publicKey));
  const deposits = depositRaws.map((raw) => decodedDeposit(raw.account, raw.publicKey));
  const liquidityPools = liquidityPoolRaws.map((raw) => decodedLiquidityPool(raw.account, raw.publicKey));
  const loans = loanRaws.map((raw) => decodedLoan(raw.account, raw.publicKey));

  return { collectionInfos, deposits, liquidityPools, loans };
};
