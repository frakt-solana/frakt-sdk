import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function initPermission({
  programId,
  provider,
  admin,
  programPubkey,
  expiration,
  canAdd,
  canHarvest,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  programPubkey: PublicKey;
  expiration: anchor.BN;
  canAdd: boolean;
  canHarvest: boolean;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
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
