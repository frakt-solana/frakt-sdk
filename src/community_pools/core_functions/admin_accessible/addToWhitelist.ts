import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

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
