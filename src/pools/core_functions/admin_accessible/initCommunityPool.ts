import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { ACCOUNT_PREFIX } from '../../constants';

interface InitCommunityPool {
  programId: PublicKey,
  userPubkey: PublicKey,
  provider: anchor.Provider,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
}

const initCommunityPool = async (params: InitCommunityPool) => {
  const {
    programId,
    userPubkey,
    provider,
    sendTxn
  } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const communityPool = anchor.web3.Keypair.generate();
  const fractionMint = anchor.web3.Keypair.generate();

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.publicKey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initPool(bump, {
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

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, [communityPool, fractionMint]);
}

export default initCommunityPool;
