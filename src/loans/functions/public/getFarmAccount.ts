import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { createFakeWallet } from '../../../common';
import { decodedFarmer } from '../../helpers';
import { FarmerView, LendingStakeView } from '../../types';
import { idl } from '../../idl/idl-gem-farm';

type GetFarmAccount = (params: {
  lendingStake: LendingStakeView;
  connection: web3.Connection;
}) => Promise<FarmerView>;

export const getFarmAccount: GetFarmAccount = async ({
  lendingStake,
  connection,
}) => {
  const encoder = new TextEncoder();
  const anchorProgram = new Program(
    idl,
    new web3.PublicKey(lendingStake.stakeContract),
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

  const [farmer] = await web3.PublicKey.findProgramAddress(
    [
      encoder.encode('farmer'),
      new web3.PublicKey(lendingStake.dataA).toBuffer(),
      new web3.PublicKey(lendingStake.identity).toBuffer(),
    ],
    new web3.PublicKey(lendingStake.stakeContract)
  );

  const farmerRaw = await anchorProgram.account.farmer.fetch(farmer);

  return decodedFarmer(farmerRaw, farmer);
};