import { web3, utils } from '@project-serum/anchor';

import { AddToWhitelist } from '../../types';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export const addToWhitelist = async (params: AddToWhitelist): Promise<any> => {
  const { isCreator, communityPool, whitelistedAddress, programId, userPubkey, connection, sendTxn } = params;

  const program = await returnCommunityPoolsAnchorProgram(programId, connection);
  const poolWhitelistAccount = web3.Keypair.generate();
  const signers = [poolWhitelistAccount];

  const instruction = program.instruction.addToWhitelist(isCreator, {
    accounts: {
      poolWhitelist: poolWhitelistAccount.publicKey,
      whitelistedAddress,
      communityPool: communityPool,
      authority: userPubkey,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
    },
    signers: signers,
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, signers);
};
