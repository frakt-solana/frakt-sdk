import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { createFakeWallet } from '../../../common';
import { decodedFarmer } from '../../helpers';
import { FarmerView } from '../../types';
import idl from '../../idl/gem_farm.json';

type GetGemFarmAccounts = (params: {
  gemFarmProgramId: web3.PublicKey;
  connection: web3.Connection;
  identity: web3.PublicKey;
}) => Promise<FarmerView[]>;

export const getGemFarmAccounts: GetGemFarmAccounts = async ({
    gemFarmProgramId,
    connection,
}) => {    
  const anchorProgram = new Program(
    idl as any,
    gemFarmProgramId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

  const farmersRaw = await anchorProgram.account.farmer.all();
  return farmersRaw.map((raw) => decodedFarmer(raw.account, raw.publicKey));
  }