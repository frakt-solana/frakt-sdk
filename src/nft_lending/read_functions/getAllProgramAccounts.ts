import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from './../contract_model/accounts';
import { Connection, PublicKey } from '@solana/web3.js';
import * as accounts from './../contract_model/accounts';
import * as utils from './../../common/utils';

export async function getAllProgramAccounts({
  programId,
  connection,
}: {
  programId: PublicKey;
  connection: Connection;
}) {
  const provider = new anchor.Provider(connection, utils.createFakeWallet(), anchor.Provider.defaultOptions());
  let program = accounts.returnAnchorProgram(programId, provider);

  const collectionInfoRaws = await program.account.collectionInfo.all();
  const depositRaws = await program.account.deposit.all();
  const liquidityPoolRaws = await program.account.liquidityPool.all();
  const loanRaws = await program.account.loan.all();

  const collectionInfos = collectionInfoRaws.map((raw) => accounts.decodedCollectionInfo(raw.account, raw.publicKey));
  const deposits = depositRaws.map((raw) => accounts.decodedDeposit(raw.account, raw.publicKey));
  const liquidityPools = liquidityPoolRaws.map((raw) => accounts.decodedLiquidityPool(raw.account, raw.publicKey));
  const loans = loanRaws.map((raw) => accounts.decodedLoan(raw.account, raw.publicKey));

  return { collectionInfos, deposits, liquidityPools, loans };
}
