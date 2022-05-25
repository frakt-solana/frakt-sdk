import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Connection, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import * as utils from './../common/utils';
import { ACCOUNT_PREFIX } from './constants';
import * as accounts from './contract_model/accounts';
import { returnCommunityPoolsAnchorProgram } from './contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

const encoder = new TextEncoder();

export async function initCommunityPool({
  programId,
  userPubkey,
  provider,
  sendTxn,
}: {
  programId: PublicKey;
  userPubkey: PublicKey;
  provider: anchor.Provider;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const communityPool = anchor.web3.Keypair.generate();
  const fractionMint = anchor.web3.Keypair.generate();

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.publicKey.toBuffer()],
    program.programId,
  );

  const tx = program.instruction.initPool(bump, {
    accounts: {
      communityPool: communityPool.publicKey,
      authority: userPubkey,
      systemProgram: SystemProgram.programId,
      fractionMint: fractionMint.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      communityPoolsAuthority: community_pools_authority,
    },
    signers: [communityPool, fractionMint],
  });

  const transaction = new Transaction().add(tx);
  const signers = [communityPool, fractionMint];

  await sendTxn(transaction, signers);
}

export async function activateCommunityPool(
  { communityPool }: { communityPool: PublicKey },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const signers = [];
  const tx = program.instruction.activatePool({
    accounts: {
      communityPool: communityPool,
      authority: userPubkey,
      systemProgram: SystemProgram.programId,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction, signers);
}

export async function addToWhitelist(
  {
    isCreator,
    communityPool,
    whitelistedAddress,
  }: { isCreator: boolean; communityPool: PublicKey; whitelistedAddress: PublicKey },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const poolWhitelistAccount = anchor.web3.Keypair.generate();

  const signers = [poolWhitelistAccount];
  const tx = program.instruction.addToWhitelist(isCreator, {
    accounts: {
      poolWhitelist: poolWhitelistAccount.publicKey,
      whitelistedAddress,
      communityPool: communityPool,
      authority: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction, signers);
}

export async function depositNftToCommunityPool(
  {
    communityPool,
    nftMint,
    nftUserTokenAccount,
    fractionMint,
    poolWhitelist,
    metadataInfo,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    nftMint: PublicKey;
    nftUserTokenAccount: PublicKey;
    fractionMint: PublicKey;
    poolWhitelist: PublicKey;
    metadataInfo: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const safetyDepositBox = anchor.web3.Keypair.generate();
  const storeNftTokenAccount = anchor.web3.Keypair.generate();

  const instructions = [];
  const userFractionsTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, fractionMint);
  if (!(await provider.connection.getAccountInfo(userFractionsTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(
      instructions,
      userFractionsTokenAccount,
      userPubkey,
      userPubkey,
      fractionMint,
    );

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  let [configOutput, bumpConfigOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  let [boardEntry, bumpBoardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    program.programId,
  );

  const signers = [safetyDepositBox, storeNftTokenAccount];
  const mainIx = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouter,
      configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      leaderboardAccount,
      feeConfig,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(mainIx);
  await sendTxn(transaction, signers);
}

export async function getLotteryTicket(
  {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    fractionMint: PublicKey;
    userFractionsTokenAccount: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const [leaderboardAuthority, bumpLead] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('leaderBoardProgramAuthority'), programId.toBuffer()],
    program.programId,
  );
  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions = [];

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  let [configOutput, bumpConfigOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [boardEntry, bumpBoardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];
  const tx = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      fractionMint: fractionMint,
      userFractionsTokenAccount: userFractionsTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouter: mainRouter,
      configOutput: configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      feeConfig: feeConfig,
      leaderboardAccount,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });
  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(tx);

  await sendTxn(transaction, signers);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey };
}

export async function revealLotteryTicket(
  {
    communityPool,
    lotteryTicket,
    safetyDepositBox,
  }: { communityPool: PublicKey; lotteryTicket: PublicKey; safetyDepositBox: PublicKey },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const signers = [];
  const tx = program.instruction.revealLotteryTicket({
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      admin: userPubkey,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction, signers);
}

export async function withdrawNftByTicket(
  {
    communityPool,
    lotteryTicket,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
  }: {
    communityPool: PublicKey;
    lotteryTicket: PublicKey;
    safetyDepositBox: PublicKey;
    nftMint: PublicKey;
    storeNftTokenAccount: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const instructions = [];
  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, nftMint);
  if (!(await provider.connection.getAccountInfo(nftUserTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(instructions, nftUserTokenAccount, userPubkey, userPubkey, nftMint);

  const signers = [];
  const mainIx = program.instruction.withdrawNftByTicket(bump, {
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftUserTokenAccount,
      nftMint: nftMint,
      storeNftTokenAccount: storeNftTokenAccount,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(mainIx);

  await sendTxn(transaction, signers);
}

export async function withdrawNftByAdmin(
  {
    communityPool,
    lotteryTicket,
    ticketHolder,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
  }: {
    communityPool: PublicKey;
    lotteryTicket: PublicKey;
    ticketHolder: PublicKey;
    safetyDepositBox: PublicKey;
    nftMint: PublicKey;
    storeNftTokenAccount: PublicKey;
  },
  {
    admin,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    admin: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const instructions = [];
  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(ticketHolder, nftMint);
  if (!(await provider.connection.getAccountInfo(nftUserTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(instructions, nftUserTokenAccount, admin, ticketHolder, nftMint);

  const signers = [];

  const withdrawIx = program.instruction.withdrawNftByAdmin(bump, {
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftUserTokenAccount,
      nftMint: nftMint,
      storeNftTokenAccount: storeNftTokenAccount,
      communityPoolsAuthority: community_pools_authority,
      admin: admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(withdrawIx);

  await sendTxn(transaction, signers);
}

export async function emergencyWithdrawByAdmin(
  {
    communityPool,
    safetyDepositBox,
    nftMint,
    storeNftTokenAccount,
  }: { communityPool: PublicKey; safetyDepositBox: PublicKey; nftMint: PublicKey; storeNftTokenAccount: PublicKey },
  {
    admin,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    admin: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const instructions = [];
  const nftAdminTokenAccount = await utils.findAssociatedTokenAddress(admin, nftMint);
  if (!(await provider.connection.getAccountInfo(nftAdminTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(instructions, nftAdminTokenAccount, admin, admin, nftMint);

  const signers = [];

  const withdrawIx = program.instruction.emergencyWithdrawByAdmin(bump, {
    accounts: {
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      nftUserTokenAccount: nftAdminTokenAccount,
      nftMint: nftMint,
      storeNftTokenAccount: storeNftTokenAccount,
      communityPoolsAuthority: community_pools_authority,
      admin: admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new Transaction();

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(withdrawIx);

  await sendTxn(transaction, signers);
}

export async function initLeaderboardReward(
  {
    communityPool,
    fractionMint,
    depositReward,
    withdrawReward,
  }: { communityPool: PublicKey; fractionMint: PublicKey; depositReward: anchor.BN; withdrawReward: anchor.BN },
  {
    admin,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    admin: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const [leaderboardAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const ix = program.instruction.initializeLeaderboard(depositReward, withdrawReward, {
    accounts: {
      communityPool,
      fractionMint,
      admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      leaderboardAccount,
    },
  });

  const transaction = new Transaction();
  transaction.add(ix);
  await sendTxn(transaction, []);
}

export async function updateLeaderboardReward(
  {
    communityPool,
    fractionMint,
    depositReward,
    withdrawReward,
  }: { communityPool: PublicKey; fractionMint: PublicKey; depositReward: anchor.BN; withdrawReward: anchor.BN },
  {
    admin,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    admin: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const [leaderboardAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const ix = program.instruction.updateLeaderboard(bump, depositReward, withdrawReward, {
    accounts: {
      communityPool,
      fractionMint,
      admin,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      leaderboardAccount,
    },
  });

  const transaction = new Transaction();
  transaction.add(ix);
  await sendTxn(transaction, []);
}

export async function getAllProgramAccounts(programId: PublicKey, connection: Connection) {
  const provider = new anchor.Provider(connection, utils.createFakeWallet(), anchor.Provider.defaultOptions());
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const communityPools = await program.account.communityPool.all();
  const lotteryTickets = await program.account.lotteryTicket.all();
  const poolWhitelists = await program.account.poolWhitelist.all();
  const safetyDepositBoxes = await program.account.safetyDepositBox.all();

  const boardEntrysRaw = await program.account.boardEntry.all();
  const poolConfigsRaw = await program.account.poolConfig.all();
  const permissionsRaw = await program.account.permission.all();
  const feeConfig = await program.account.feeConfig.all();

  const boardEntrys = boardEntrysRaw.map((raw) => accounts.decodedBoardEntry(raw.account, raw.publicKey));
  const poolConfigs = poolConfigsRaw.map((raw) => accounts.decodedPoolConfig(raw.account, raw.publicKey));
  const permissions = permissionsRaw.map((raw) => accounts.decodedPermission(raw.account, raw.publicKey));

  return {
    communityPools,
    lotteryTickets,
    poolWhitelists,
    safetyDepositBoxes,
    boardEntrys,
    poolConfigs,
    permissions,
    feeConfig,
  };
}

export async function initConfig(
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  tokenMint: PublicKey,
  sendTxn: any,
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let encoder = new TextEncoder();

  const [vaultOwnerPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await utils.findAssociatedTokenAddress(vaultOwnerPda, tokenMint);

  const [config, bumpPerm] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const tx = program.instruction.intializeConfig(bump, {
    accounts: {
      admin: admin,
      tokenMint: tokenMint,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction);
}

export async function topupConfig(
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  tokenMint: PublicKey,
  inputAmount: anchor.BN,
  sendTxn: any,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [vaultOwnerPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, tokenMint);

  const vaultTokenAccount = await utils.findAssociatedTokenAddress(vaultOwnerPda, tokenMint);
  const [config, bumpConfig] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const tx = program.instruction.topupConfig(bump, bumpConfig, inputAmount, {
    accounts: {
      admin: admin,
      tokenMint: tokenMint,
      adminTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });
  const transaction = new Transaction().add(tx);

  await sendTxn(transaction);
}

export async function initPermission(
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  programPubkey: PublicKey,
  expiration: anchor.BN,
  canAdd: boolean,
  canHarvest: boolean,
  sendTxn: any,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [permission, bumpPerm] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('Permission'), programPubkey.toBuffer()],
    program.programId,
  );

  const ix = program.instruction.initializePermission(expiration, canAdd, canHarvest, {
    accounts: {
      admin,
      programPubkey,
      permission,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  let transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function initBoardEntry(
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  sendTxn: any,
  initialBalance?: anchor.BN,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpReward] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );
  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

  const ix = await program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  let transaction = new Transaction().add(ix);
  await sendTxn(transaction, []);
}

export async function initBoardEntryInstruction(
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  initialBalance?: anchor.BN,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpReward] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );
  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

  const ix = await program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  return ix;
}

export async function harvestScore(
  programId: PublicKey,
  provider: anchor.Provider,
  userPublicKey: PublicKey,
  tokenMint: PublicKey,
  sendTxn: any,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpBoard] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPublicKey.toBuffer()],
    program.programId,
  );

  const [config, bumpConfig] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );
  const [vaultOwnerPda, bumpAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), program.programId.toBuffer()],
    program.programId,
  );
  const vaultTokenAccount = await utils.findAssociatedTokenAddress(vaultOwnerPda, tokenMint);
  const userTokenAccount = await utils.findAssociatedTokenAddress(userPublicKey, tokenMint);
  const ix = await program.instruction.harvestScore(bumpBoard, bumpAuth, bumpConfig, {
    accounts: {
      user: userPublicKey,
      tokenMint: tokenMint,
      userTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });
  let transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}

export async function initializeFee(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  depositFeeAdmin: number,
  depositFeePool: number,
  getLotteryFeeAdmin: number,
  getLotteryFeePool: number,
  sendTxn: any,
  communityPool?: PublicKey,
) {
  let config = anchor.web3.Keypair.generate();
  const transaction = new Transaction();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  if (communityPool == null) {
    communityPool = new PublicKey('11111111111111111111111111111111');
  }

  const signers = [config];
  let ix = await program.instruction.initializeFee(
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    {
      accounts: {
        config: config.publicKey,
        admin: userPubkey,
        communityPool,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [config],
    },
  );

  transaction.add(ix);

  await sendTxn(transaction, signers);

  return config.publicKey;
}

export async function updateFee(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  config: PublicKey,
  depositFeeAdmin: number,
  depositFeePool: number,
  getLotteryFeeAdmin: number,
  getLotteryFeePool: number,
  sendTxn: any,
) {
  const transaction = new Transaction();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let ix = await program.instruction.updateFee(depositFeeAdmin, depositFeePool, getLotteryFeeAdmin, getLotteryFeePool, {
    accounts: {
      admin: userPubkey,
      config: config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  transaction.add(ix);

  await sendTxn(transaction, []);
}

export async function updateConnection(
  programId: PublicKey,
  provider: anchor.Provider,
  userPubkey: PublicKey,
  communityPool: PublicKey,
  fractionMint: PublicKey,
  fusion: PublicKey,
  sendTxn: any,
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let tx = await program.transaction.updateConnection({
    accounts: {
      admin: userPubkey,
      communityPool,
      fractionMint,
      router: fusion,
    },
  });

  await sendTxn(tx, []);
}

export async function depositNftToCommunityPoolIx(
  {
    communityPool,
    nftMint,
    nftUserTokenAccount,
    fractionMint,
    poolWhitelist,
    metadataInfo,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    nftMint: PublicKey;
    nftUserTokenAccount: PublicKey;
    fractionMint: PublicKey;
    poolWhitelist: PublicKey;
    metadataInfo: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const safetyDepositBox = anchor.web3.Keypair.generate();
  const storeNftTokenAccount = anchor.web3.Keypair.generate();

  const instructions: TransactionInstruction[] = [];
  const userFractionsTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, fractionMint);
  if (!(await provider.connection.getAccountInfo(userFractionsTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(
      instructions,
      userFractionsTokenAccount,
      userPubkey,
      userPubkey,
      fractionMint,
    );

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  if (!(await provider.connection.getAccountInfo(mainRouter))) {
    vaultTokenAccountOutput = adminTokenAccount;
    vaultOwnerPda = tokenMintInputFusion;
  }

  let [configOutput, bumpConfigOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  let [boardEntry, bumpBoardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    program.programId,
  );

  const signers = [safetyDepositBox, storeNftTokenAccount];
  const mainIx = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouter,
      configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      leaderboardAccount,
      feeConfig,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });
  instructions.push(mainIx);
  return { instructions, signers };
}

export async function getLotteryTicketIx(
  {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    fractionMint: PublicKey;
    userFractionsTokenAccount: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const [leaderboardAuthority, bumpLead] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('leaderBoardProgramAuthority'), programId.toBuffer()],
    program.programId,
  );
  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions: TransactionInstruction[] = [];

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  let [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );
  let [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  if (!(await provider.connection.getAccountInfo(mainRouter))) {
    vaultOwnerPda = tokenMintInputFusion;
  }
  let [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];
  const tx = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      fractionMint: fractionMint,
      userFractionsTokenAccount: userFractionsTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouter: mainRouter,
      configOutput: configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      feeConfig: feeConfig,
      leaderboardAccount,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  instructions.push(tx);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey, instructions, signers };
}
