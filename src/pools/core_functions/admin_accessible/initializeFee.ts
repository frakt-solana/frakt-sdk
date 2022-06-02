import anchor from '@project-serum/anchor';
import { PublicKey, Transaction, Keypair } from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export interface InitializeFee {
  programId: PublicKey;
  provider: anchor.Provider;
  userPubkey: PublicKey;
  depositFeeAdmin: number;
  depositFeePool: number;
  getLotteryFeeAdmin: number;
  getLotteryFeePool: number;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  communityPool?: PublicKey;
}

const initializeFee = async (params: InitializeFee): Promise<any> => {
  const {
    programId,
    provider,
    userPubkey,
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    sendTxn,
    communityPool = new PublicKey('11111111111111111111111111111111'),
  } = params;

  const config = anchor.web3.Keypair.generate();
  const transaction = new Transaction();
  const signers = [config];

  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const instruction = await program.instruction.initializeFee(
    depositFeeAdmin,
    depositFeePool,
    getLotteryFeeAdmin,
    getLotteryFeePool,
    {
      accounts: {
        config: config.publicKey,
        admin: userPubkey,
        communityPool,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [config],
    },
  );

  transaction.add(instruction);

  await sendTxn(transaction, signers);

  return config.publicKey;
};

export default initializeFee;
