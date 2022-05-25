import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { ACCOUNT_PREFIX } from './../../constants';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

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
