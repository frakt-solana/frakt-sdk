import { web3 } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';
import { InitCommunityPool } from '../../types';
import { TOKEN_PROGRAM_ID } from '../../../common/constants';

export const initCommunityPool = async (params: InitCommunityPool) => {
  const { programId, userPubkey, connection, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);
  const communityPool = web3.Keypair.generate();
  const fractionMint = web3.Keypair.generate();

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.publicKey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initPool(bump, {
    accounts: {
      communityPool: communityPool.publicKey,
      authority: userPubkey,
      systemProgram: web3.SystemProgram.programId,
      fractionMint: fractionMint.publicKey,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      communityPoolsAuthority: community_pools_authority,
    },
    signers: [communityPool, fractionMint],
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, [communityPool, fractionMint]);
  return { communityPool: communityPool.publicKey, fractionMint: fractionMint.publicKey };
};
