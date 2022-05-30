import anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { returnAnchorProgram, decodedCollectionInfo, decodedDeposit, decodedLiquidityPool, decodedLoan } from '../contract_model/accounts';
import { createFakeWallet } from '../../common/utils';

interface IReturn {
  collectionInfos: any[];
  deposits: any[];
  liquidityPools: any[];
  loans: any[];
}

const getAllProgramAccounts = async (
  programId: PublicKey,
  connection: Connection
): Promise<IReturn> => {
  const provider = new anchor.Provider(connection, createFakeWallet(), anchor.Provider.defaultOptions());
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

export default getAllProgramAccounts;
