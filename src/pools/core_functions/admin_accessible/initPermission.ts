import { web3 } from'@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { InitPermission } from '../../types';

export const initPermission = async (params: InitPermission) => {
  const { programId, provider, admin, programPubkey, expiration, canAdd, canHarvest, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [permission] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('Permission'), programPubkey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initializePermission(expiration, canAdd, canHarvest, {
    accounts: {
      admin,
      programPubkey,
      permission,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
