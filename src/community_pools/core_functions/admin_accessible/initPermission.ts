import anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

const initPermission = async (
  programId: PublicKey,
  provider: anchor.Provider,
  admin: PublicKey,
  programPubkey: PublicKey,
  expiration: anchor.BN,
  canAdd: boolean,
  canHarvest: boolean,
  sendTxn: any,
) => {
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [permission] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('Permission'), programPubkey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initializePermission(expiration, canAdd, canHarvest, {
    accounts: {
      admin,
      programPubkey,
      permission,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
}

export default initPermission;
