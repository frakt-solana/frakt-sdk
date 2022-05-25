import * as anchor from '@project-serum/anchor';
export { AllAccounts, CollectionInfoView, LiquidityPoolView, DepositView, LoanView } from './accounts';
import { PublicKey, Connection, Transaction, Keypair, TransactionInstruction } from '@solana/web3.js';
import * as utils from './../common/utils';
import * as accounts from './accounts';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
const encoder = new TextEncoder();

export async function approveLoanByAdmin({
  programId,
  provider,
  admin,
  loan,
  liquidityPool,
  collectionInfo,
  nftPrice,
  discount,
  user,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  loan: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;

  nftPrice: number | anchor.BN;
  discount: number | anchor.BN;
  user: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  // const accountRentExempt = await provider.connection.getMinimumBalanceForRentExemption(AccountLayout.span);

  // let signers: Keypair[] = [];
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );
  // const instructions: TransactionInstruction[] = [];

  // instructions.push(
  const instr = program.instruction.approveLoanByAdmin(new anchor.BN(nftPrice), new anchor.BN(discount), {
    accounts: {
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      // tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  // );

  const transaction = new Transaction().add(instr);
  // for (let ix of instructions) transaction.add(ix);

  await sendTxn(transaction);
}

export async function depositLiquidity({
  programId,
  provider,
  liquidityPool,
  user,
  amount,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const [deposit, depositBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );
  const instr = program.instruction.depositLiquidity(new anchor.BN(amount), {
    accounts: {
      liquidityPool: liquidityPool,
      liqOwner,
      deposit,
      user: user,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instr);
  await sendTxn(transaction);
}

export async function unstakeLiquidity({
  programId,
  provider,
  liquidityPool,
  user,
  amount,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: anchor.BN | number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const [deposit, depositBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );
  const ix = program.instruction.unstakeLiquidity(depositBump, new anchor.BN(amount), {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function harvestLiquidity({
  programId,
  provider,
  liquidityPool,
  user,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const [deposit, depositBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );
  const ix = program.instruction.harvestLiquidity(depositBump, {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function updateCollectionInfo({
  programId,
  provider,
  liquidityPool,
  admin,
  creatorAddress,
  pricingLookupAddress,
  loanToValue,
  collaterizationRate,
  royaltyAddress,
  collectionInfo,
  royaltyFeeTime,
  royaltyFeePrice,
  expirationTime,
  isPriceBased,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  admin: PublicKey;
  creatorAddress: PublicKey;
  collectionInfo: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const ix = await program.instruction.updateCollectionInfo(
    {
      loanToValue: new anchor.BN(loanToValue),
      collaterizationRate: new anchor.BN(collaterizationRate),
      royaltyFeeTime: new anchor.BN(royaltyFeeTime),
      royaltyFeePrice: new anchor.BN(royaltyFeePrice),
      expirationTime: new anchor.BN(expirationTime),
      isPriceBased,
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        collectionInfo: collectionInfo,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
      },
    },
  );

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
  // return collectionInfo;
}

export async function initializeCollectionInfo({
  programId,
  provider,
  liquidityPool,
  admin,
  creatorAddress,
  pricingLookupAddress,
  loanToValue,
  collaterizationRate,
  royaltyAddress,
  royaltyFeeTime,
  royaltyFeePrice,
  expirationTime,
  isPriceBased,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  admin: PublicKey;
  creatorAddress: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const collectionInfo = Keypair.generate();

  const ix = await program.instruction.initializeCollectionInfo(
    {
      loanToValue: new anchor.BN(loanToValue),
      collaterizationRate: new anchor.BN(collaterizationRate),
      royaltyFeeTime: new anchor.BN(royaltyFeeTime),
      royaltyFeePrice: new anchor.BN(royaltyFeePrice),
      expirationTime: new anchor.BN(expirationTime),
      isPriceBased,
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        collectionInfo: collectionInfo.publicKey,
        admin: admin,
        creatorAddress: creatorAddress,
        royaltyAddress,
        pricingLookupAddress: pricingLookupAddress,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction, [collectionInfo]);
  return collectionInfo.publicKey;
}

export async function initializeLiquidityPool({
  programId,
  provider,
  admin,
  rewardInterestRateTime,
  rewardInterestRatePrice,
  feeInterestRateTime,
  feeInterestRatePrice,
  id,
  period,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const liquidityPool = Keypair.generate();
  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.publicKey.toBuffer()],
    program.programId,
  );
  const ix = program.instruction.initializeLiquidityPool(
    liqOwnerBump,
    {
      rewardInterestRateTime: new anchor.BN(rewardInterestRateTime),
      rewardInterestRatePrice: new anchor.BN(rewardInterestRatePrice),
      feeInterestRateTime: new anchor.BN(feeInterestRateTime),
      feeInterestRatePrice: new anchor.BN(feeInterestRatePrice),
      id: new anchor.BN(id),
      period: new anchor.BN(period),
    },
    {
      accounts: {
        liquidityPool: liquidityPool.publicKey,
        liqOwner,
        admin: admin,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction, [liquidityPool]);
  return liquidityPool.publicKey;
}

export async function updateLiquidityPool({
  programId,
  provider,
  admin,
  liquidityPool,
  rewardInterestRateTime,
  rewardInterestRatePrice,
  feeInterestRateTime,
  feeInterestRatePrice,
  id,
  period,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  liquidityPool: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const ix = program.instruction.updateLiquidityPool(
    {
      rewardInterestRateTime: new anchor.BN(rewardInterestRateTime),
      rewardInterestRatePrice: new anchor.BN(rewardInterestRatePrice),
      feeInterestRateTime: new anchor.BN(feeInterestRateTime),
      feeInterestRatePrice: new anchor.BN(feeInterestRatePrice),
      id: new anchor.BN(id),
      period: new anchor.BN(period),
    },
    {
      accounts: {
        liquidityPool: liquidityPool,
        admin: admin,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
  // return liquidityPool;
}

export async function liquidateLoanByAdmin({
  programId,
  provider,
  liquidator,
  user,
  loan,
  nftMint,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidator: PublicKey;
  user: PublicKey;
  loan: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const instructions: TransactionInstruction[] = [];
  const nftLiquidatorTokenAccount = await utils.findAssociatedTokenAddress(liquidator, nftMint);
  const editionId = await Edition.getPDA(nftMint);
  const instr = program.instruction.liquidateLoanByAdmin(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidator: liquidator,
      nftMint: nftMint,
      nftLiquidatorTokenAccount: nftLiquidatorTokenAccount,
      user: user,
      nftUserTokenAccount: nftUserTokenAccount,
      communityPoolsAuthority,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(instr);
  await sendTxn(transaction);
}

export async function paybackLoan({
  programId,
  provider,
  user,
  admin,

  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  admin: PublicKey;

  loan: PublicKey;
  nftMint: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;
  royaltyAddress: PublicKey;

  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  // const instructions: TransactionInstruction[] = [];
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const editionId = await Edition.getPDA(nftMint);
  const instr = program.instruction.paybackLoan(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidityPool: liquidityPool,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      liqOwner,
      communityPoolsAuthority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(instr);

  await sendTxn(transaction);
}

export async function proposeLoan({
  proposedNftPrice,
  programId,
  provider,
  user,
  nftMint,
  isPriceBased,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  nftMint: PublicKey;
  proposedNftPrice: number | anchor.BN;
  isPriceBased: boolean;

  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const loan = Keypair.generate();
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);

  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const ix = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, new anchor.BN(proposedNftPrice), {
    accounts: {
      loan: loan.publicKey,
      user: user,
      nftUserTokenAccount,
      nftMint: nftMint,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
    // signers: [loan]
  });
  const transaction = new Transaction().add(ix);

  await sendTxn(transaction, [loan]);

  return { loanPubkey: loan.publicKey };
}

export async function rejectLoanByAdmin({
  programId,
  provider,
  loan,
  nftUserTokenAccount,
  admin,
  user,
  nftMint,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  nftUserTokenAccount: PublicKey;
  admin: PublicKey;
  user: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );
  // const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);

  const editionId = await Edition.getPDA(nftMint);
  const ix = program.instruction.rejectLoanByAdmin(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      admin: admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      user: user,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function closeLoanByAdmin({
  programId,
  provider,
  loan,
  admin,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  admin: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const ix = await program.methods
    .closeLoan(bumpPoolsAuth)
    .accounts({
      loan: loan,
      admin: admin,
      communityPoolsAuthority,
    })
    .instruction();

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function getAllProgramAccounts(programId: PublicKey, connection: Connection) {
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

  // return { collectionInfos, deposits, liquidityPools, loans };
  return { collectionInfos, deposits, liquidityPools, loans }; //loanRaws };
}

export function objectBNsToNums(obj) {
  for (let key in obj) {
    if (obj[key].toNumber) {
      obj[key] = obj[key].toNumber();
    }
  }
  return obj;
}

export function decodeLoan(buffer: Buffer, connection: Connection, programId: PublicKey) {
  const program = accounts.returnAnchorProgram(
    programId,
    new anchor.Provider(connection, utils.createFakeWallet(), anchor.Provider.defaultOptions()),
  );
  return program.coder.accounts.decode('loan', buffer);
}

export function CalculateStatFromAccounts(allAccounts: accounts.AllAccounts) {
  // allAccounts.loans.forEach((loan) => {
  //   console.log(Object.keys(loan.loanStatus)[0] == "activated")
  // })
  console.log('loan1: ', allAccounts.loans[0]);
  const activeLoans = allAccounts.loans.filter(
    (loan) =>
      // objectloan.loanStatus == {activated: {}}
      Object.keys(loan.loanStatus)[0] == 'activated',
  );

  // console.log(activeLoans)
  const lockedNftsInLoans = activeLoans.length;
  const loansVolumeAllTime: number = allAccounts.loans.reduce((acc, loan) => acc + loan.amountToGet, 0) / 1e9;
  // 0;
  // for (let i = 0; i < allAccounts.loans.length; i++) {
  //   loansVolumeAllTime += allAccounts.loans[i].amountToGet;
  // }
  // const loansLast7Days = allAccounts.loans.filter((el) => el.startedAt + 86400 * 7 > Math.floor(Date.now() / 1000));
  // console.log(loanLast7Days.length)
  const loansVolume7Days: number =
    allAccounts.loans
      .filter((el) => el.startedAt + 86400 * 7 > Math.floor(Date.now() / 1000))
      .reduce((acc, loan) => acc + loan.amountToGet, 0) / 1e9;
  // const TVL = activeLoans.forEach((el, counter) => {
  //   counter += el.originalPrice
  // }) + allAccounts.liquidityPool.forEach((el, counter) => {
  //   counter += el.amountOfStaked
  // })
  // const TVL = activeLoans.reduce((el) => {
  //     counter += el.originalPrice
  //     return counter
  const TVL =
    (activeLoans.reduce((acc, loan) => acc + loan.originalPrice, 0) +
      allAccounts.liquidityPools.reduce((acc, liquidityPool) => acc + liquidityPool.amountOfStaked, 0)) /
    1e9;

  // то есть ты можешь по started_at посмотреть сколько выдано за 24 часа,
  //  по finished at можешь посмотреть сколько ликвидированных и выплаченных

  const totalIssued = allAccounts.loans.filter((loan) => Object.keys(loan.loanStatus)[0] != 'rejected').length;
  const SECONDS_IN_24_HOURS = 86400;
  const issuedIn24Hours = allAccounts.loans
    .filter((loan) => Object.keys(loan.loanStatus)[0] == 'activated' || Object.keys(loan.loanStatus)[0] == 'paidBack')
    .filter((loan) => loan.startedAt > now() - SECONDS_IN_24_HOURS).length;

  const liquidatedIn24Hours = allAccounts.loans
    .filter((loan) => Object.keys(loan.loanStatus)[0] == 'liquidated')
    .filter((loan) => loan.startedAt > now() - SECONDS_IN_24_HOURS).length;

  const paidBackIn24Hours = allAccounts.loans
    .filter((loan) => Object.keys(loan.loanStatus)[0] == 'paidBack')
    .filter((loan) => loan.startedAt > now() - SECONDS_IN_24_HOURS).length;
  // Active funds это суммарно сколько застейкано
  // TVL это суммарная ценность NFT которые в активных лоанах

  // Locked NFTs in Pools,
  // Locked NFTs in Loans (Loaned nfts)+
  // TVL in Pools (NFTs + value, staked liquidity),
  // TVL in Loans (loaned NFTs + value, provided liquidity) +
  // Pools volume all time, 7 day in SOL (buy/sell in Pools)
  // Loans volume all time, 7 day in SOL (issued loans) +

  return {
    lockedNftsInLoans,
    loansVolumeAllTime,
    loansVolume7Days,
    TVL,
    issuedIn24Hours,
    liquidatedIn24Hours,
    paidBackIn24Hours,
    totalIssued,
  };
}

function now() {
  return Math.round(Date.now() / 1000);
}
