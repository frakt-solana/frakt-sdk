import { web3 } from'@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { RevealLotteryTicket } from '../../types';

export const revealLotteryTicket = async (params: RevealLotteryTicket) => {
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

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, signers);
};
