import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Transaction, SystemProgram } from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { AddToWhitelist } from '../../types';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export const addToWhitelist = async (params: AddToWhitelist): Promise<any> => {
  const { isCreator, communityPool, whitelistedAddress, programId, userPubkey, provider, sendTxn } = params;

  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const poolWhitelistAccount = anchor.web3.Keypair.generate();
  const signers = [poolWhitelistAccount];

  const instruction = program.instruction.addToWhitelist(isCreator, {
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

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, signers);
};
