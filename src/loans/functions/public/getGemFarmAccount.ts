import { web3, Program, AnchorProvider} from '@project-serum/anchor';
import idl from '../../idl/gem_farm.json';
import { createFakeWallet } from '../../../common';
import {
  decodedFarmer,
} from '../../helpers';
import  { FarmerView } from "../../types";

type GetGemFarmAccount = (params: {
  gemFarmProgramId: web3.PublicKey;
  connection: web3.Connection;
  identity: web3.PublicKey;
}) => Promise<FarmerView[]>;

export const getAllFarmersGemFarm: GetGemFarmAccount = async ({
    gemFarmProgramId,
    connection,
    identity,

}) => {    
    const anchorProgram = new Program(
      idl as any,
      gemFarmProgramId,// new PublicKey("FQzYycoqRjmZTgCcTTAkzceH2Ju8nzNLa5d78K3yAhVW"),
      new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
    );
    const farmersRaw = await anchorProgram.account.farmer.all();
    const farmers = farmersRaw.map((raw) => decodedFarmer(raw.account, raw.publicKey));
    return farmers;  
  }