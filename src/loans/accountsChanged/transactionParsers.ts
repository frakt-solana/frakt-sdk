import {
  CollectionInfoView,
  DepositView,
  LiquidationLotView,
  LoanView,
  PriceBasedLiquidityPoolView,
  TimeBasedLiquidityPoolView,
  PRICE_BASED_LOAN_TYPE,
  TIME_BASED_LOAN_TYPE
} from '../types';
import {
  fetchAndParseCollectionInfo,
  fetchAndParseDeposit,
  fetchAndParseLiquidationLot,
  fetchAndParseLoan,
  fetchAndParsePriceBasedLiquidityPool,
  fetchAndParseTimeBasedLiquidityPool,
} from './fetchAndParsers';
import { TransactionAccountParserParams } from './onAccountsChanged';

export interface AccountsChanged {
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  timeBasedLiquidityPools: TimeBasedLiquidityPoolView[];
  priceBasedLiquidityPools: PriceBasedLiquidityPoolView[];
  loans: LoanView[];
  liquidationLots: LiquidationLotView[];
}

export const TRANSACTION_ACCOUNT_PARSERS = {
  'Program log: Instruction: ProposeLoan': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: (transaction.transaction.message.instructions[1] as any).accounts[0],
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [loan],
      liquidationLots: [],
    };
  },
  'Program log: Instruction: ApproveLoanByAdmin': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    // console.log("instructionAccounts: ", instructionAccounts);

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidityPoolPubkey = instructionAccounts[2];
    const timeBasedLiquidityPools =
      loan.loanType === TIME_BASED_LOAN_TYPE
        ? [
          await fetchAndParseTimeBasedLiquidityPool({
            timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];
    const priceBasedLiquidityPools =
      loan.loanType === PRICE_BASED_LOAN_TYPE
        ? [
          await fetchAndParsePriceBasedLiquidityPool({
            priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [loan],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: PaybackLoan': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[1] as any).accounts;

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidityPoolPubkey = instructionAccounts[1];
    const timeBasedLiquidityPools =
      loan.loanType === TIME_BASED_LOAN_TYPE
        ? [
          await fetchAndParseTimeBasedLiquidityPool({
            timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];
    const priceBasedLiquidityPools =
      loan.loanType === PRICE_BASED_LOAN_TYPE
        ? [
          await fetchAndParsePriceBasedLiquidityPool({
            priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [loan],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: PutLoanToLiquidationRaffles': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[1] as any).accounts;

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidationLot = await fetchAndParseLiquidationLot({
      programId,
      connection,
      liquidationLotPubkey: instructionAccounts[1],
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [loan],
      liquidationLots: [liquidationLot],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: RejectLoanByAdmin': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: (transaction.transaction.message.instructions[1] as any).accounts[0],
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [loan],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: LiquidateNftToRaffles': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[1] as any).accounts;

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidationLot = await fetchAndParseLiquidationLot({
      programId,
      connection,
      liquidationLotPubkey: instructionAccounts[1],
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [loan],
      liquidationLots: [liquidationLot],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: PaybackWithGrace': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[1] as any).accounts;

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidationLot = await fetchAndParseLiquidationLot({
      programId,
      connection,
      liquidationLotPubkey: instructionAccounts[1],
    });

    const liquidityPoolPubkey = instructionAccounts[1];
    const timeBasedLiquidityPools =
      loan.loanType === TIME_BASED_LOAN_TYPE
        ? [
          await fetchAndParseTimeBasedLiquidityPool({
            timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];
    const priceBasedLiquidityPools =
      loan.loanType === PRICE_BASED_LOAN_TYPE
        ? [
          await fetchAndParsePriceBasedLiquidityPool({
            priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
            programId,
            connection,
          }),
        ]
        : [];

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [loan],
      liquidationLots: [liquidationLot],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: DepositLiquidity': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;

    const deposit = await fetchAndParseDeposit({
      programId,
      connection,
      depositPubkey: instructionAccounts[2],
    });
    const liquidityPoolPubkey = instructionAccounts[0];

    const timeBasedLiquidityPools: any = [];
    try {
      const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
        timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      timeBasedLiquidityPools.push(timeBasedLiquidityPool);
    } catch (err) { }
    const priceBasedLiquidityPools: any = [];
    try {
      const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
        priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      priceBasedLiquidityPools.push(priceBasedLiquidityPool);
    } catch (err) { }
    return {
      collectionInfos: [],
      deposits: [deposit],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: HarvestLiquidity': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;

    const deposit = await fetchAndParseDeposit({
      programId,
      connection,
      depositPubkey: instructionAccounts[2],
    });
    const liquidityPoolPubkey = instructionAccounts[0];

    const timeBasedLiquidityPools: any = [];
    try {
      const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
        timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      timeBasedLiquidityPools.push(timeBasedLiquidityPool);
    } catch (err) { }
    const priceBasedLiquidityPools: any = [];
    try {
      const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
        priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      priceBasedLiquidityPools.push(priceBasedLiquidityPool);
    } catch (err) { }
    return {
      collectionInfos: [],
      deposits: [deposit],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: UnstakeLiquidity': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;

    const deposit = await fetchAndParseDeposit({
      programId,
      connection,
      depositPubkey: instructionAccounts[1],
    });
    const liquidityPoolPubkey = instructionAccounts[0];

    const timeBasedLiquidityPools: any = [];
    try {
      const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
        timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      timeBasedLiquidityPools.push(timeBasedLiquidityPool);
    } catch (err) { }
    const priceBasedLiquidityPools: any = [];
    try {
      const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
        priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      priceBasedLiquidityPools.push(priceBasedLiquidityPool);
    } catch (err) { }
    return {
      collectionInfos: [],
      deposits: [deposit],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: StopLiquidationRaffles': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[1] as any).accounts;

    const loan = await fetchAndParseLoan({
      programId,
      connection,
      loanPubkey: instructionAccounts[0],
    });

    const liquidationLot = await fetchAndParseLiquidationLot({
      programId,
      connection,
      liquidationLotPubkey: instructionAccounts[1],
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [loan],
      liquidationLots: [liquidationLot],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: InitializePriceBasedLiquidityPool': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];

    const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
      priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [priceBasedLiquidityPool],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: UpdatePriceBasedLiquidityPool': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];

    const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
      priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [priceBasedLiquidityPool],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: InitializeTimeBasedLiquidityPool': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];

    const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
      timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [timeBasedLiquidityPool],
      priceBasedLiquidityPools: [],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: UpdateTimeBasedLiquidityPool': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];

    const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
      timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: [timeBasedLiquidityPool],
      priceBasedLiquidityPools: [],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: InitializeCollectionInfo': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const collectionInfoPubkey = instructionAccounts[0];
    const collectionInfo = await fetchAndParseCollectionInfo({
      collectionInfoPubkey: collectionInfoPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [collectionInfo],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: UpdateCollectionInfo': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const collectionInfoPubkey = instructionAccounts[0];
    const collectionInfo = await fetchAndParseCollectionInfo({
      collectionInfoPubkey: collectionInfoPubkey,
      programId,
      connection,
    });

    return {
      collectionInfos: [collectionInfo],
      deposits: [],
      timeBasedLiquidityPools: [],
      priceBasedLiquidityPools: [],
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
  'Program log: Instruction: TopupFromLiqLoansToPool': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];
    const timeBasedLiquidityPools: any = [];
    try {
      const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
        timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      timeBasedLiquidityPools.push(timeBasedLiquidityPool);
    } catch (err) { }
    const priceBasedLiquidityPools: any = [];
    try {
      const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
        priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      priceBasedLiquidityPools.push(priceBasedLiquidityPool);
    } catch (err) { }
    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },

  'Program log: Instruction: WithdrawFromReserveFund': async ({
    transaction,
    programId,
    connection,
  }: TransactionAccountParserParams): Promise<AccountsChanged> => {
    const instructionAccounts = (transaction.transaction.message.instructions[0] as any).accounts;
    const liquidityPoolPubkey = instructionAccounts[0];
    const timeBasedLiquidityPools: any = [];
    try {
      const timeBasedLiquidityPool = await fetchAndParseTimeBasedLiquidityPool({
        timeBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      timeBasedLiquidityPools.push(timeBasedLiquidityPool);
    } catch (err) { }
    const priceBasedLiquidityPools: any = [];
    try {
      const priceBasedLiquidityPool = await fetchAndParsePriceBasedLiquidityPool({
        priceBasedLiquidityPoolPubkey: liquidityPoolPubkey,
        programId,
        connection,
      });
      priceBasedLiquidityPools.push(priceBasedLiquidityPool);
    } catch (err) { }
    return {
      collectionInfos: [],
      deposits: [],
      timeBasedLiquidityPools: timeBasedLiquidityPools,
      priceBasedLiquidityPools: priceBasedLiquidityPools,
      loans: [],
      liquidationLots: [],
      // lotTickets: [],
      // nftAttempts: [],
    };
  },
};
