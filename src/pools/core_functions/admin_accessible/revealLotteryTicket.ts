import anchor from '@project-serum/anchor';
import { PublicKey, Keypair, Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export interface RevealLotteryTicket {
  communityPool: PublicKey;
  lotteryTicket: PublicKey;
  safetyDepositBox: PublicKey;
  programId: PublicKey;
  userPubkey: PublicKey;
  provider: anchor.Provider;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

const revealLotteryTicket = async (params: RevealLotteryTicket) => {
  const { communityPool, lotteryTicket, safetyDepositBox, programId, userPubkey, provider, sendTxn } = params;

  const signers = [];
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const instruction = program.instruction.revealLotteryTicket({
    accounts: {
      lotteryTicket: lotteryTicket,
      communityPool: communityPool,
      safetyDepositBox: safetyDepositBox,
      admin: userPubkey,
    },
    signers: signers,
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, signers);
};

export default revealLotteryTicket;
