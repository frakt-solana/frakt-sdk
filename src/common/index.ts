import { web3, utils } from '@project-serum/anchor';

import { NodeWallet } from './classes/nodewallet';
import { BulkNft, BulkNftRaw } from './types';

//when we only want to view vaults, no need to connect a real wallet.
export const createFakeWallet = () => {
  const leakedKp = web3.Keypair.fromSecretKey(
    Uint8Array.from([
      208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242, 120, 4, 78, 75, 19, 227, 13, 215, 184,
      108, 226, 53, 111, 149, 179, 84, 137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158, 226,
      207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
    ]),
  );
  return new NodeWallet(leakedKp);
};

export const findAssociatedTokenAddress = async (
  walletAddress: web3.PublicKey,
  tokenMintAddress: web3.PublicKey,
): Promise<web3.PublicKey> =>
  (
    await web3.PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), utils.token.TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      utils.token.ASSOCIATED_PROGRAM_ID,
    )
  )[0];

export const getTokenBalance = async (pubkey: web3.PublicKey, connection: web3.Connection) => {
  const balance = await connection.getTokenAccountBalance(pubkey);

  return parseInt(balance.value.amount);
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: web3.PublicKey,
  payer: web3.PublicKey,
  walletAddress: web3.PublicKey,
  splTokenMintAddress: web3.PublicKey,
): web3.TransactionInstruction[] => {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: utils.token.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  return [
    new web3.TransactionInstruction({
      keys,
      programId: utils.token.ASSOCIATED_PROGRAM_ID,
      data: Buffer.from([]),
    }),
  ];
};

export const getSuggestedLoans = (items: BulkNftRaw[], minValue: number) => {
  let sum = 0;
  let i = 0;
  const best: BulkNft[] = [];
  const cheapest: BulkNft[] = [];
  const safest: BulkNft[] = [];

  const sortedElementsByValue = items.sort((a, b) => {
    if (a.maxLoanValue !== b.maxLoanValue) {
      return a.maxLoanValue - b.maxLoanValue;
    }

    return a.interest - b.interest;
  });
  const sortedElementsByInterest = items.sort((a, b) => {
    if (a.interest !== b.interest) {
      return a.interest - b.interest;
    } else if (a.maxLoanValue !== b.maxLoanValue) {
      return a.maxLoanValue - b.maxLoanValue;
    }

    return a.amountOfDays - b.amountOfDays;
  });
  const priceBased = sortedElementsByInterest.filter((element) => element.maxLoanValue !== element.minLoanValue);
  const timeBased = sortedElementsByInterest.filter((element) => element.maxLoanValue === element.minLoanValue);

  const concated = priceBased.concat(timeBased);

  while (sum < minValue && i < sortedElementsByValue.length) {
    best.push({
      nftMint: sortedElementsByValue[i].nftMint,
      loanValue: sortedElementsByValue[i].maxLoanValue,
      interest: sortedElementsByValue[i].interest,
      amountOfDays: sortedElementsByValue[i].amountOfDays
    });
    sum += sortedElementsByValue[i].maxLoanValue;
    i += 1;
  }

  if (sum < minValue) {
    return {
      best: best,
      safest: best,
      cheapest: best,
    };
  }

  sum = 0;
  i = 0;

  while (sum < minValue && i < concated.length) {
    cheapest.push({
      nftMint: concated[i].nftMint,
      loanValue: concated[i].maxLoanValue,
      interest: concated[i].interest,
      amountOfDays: concated[i].amountOfDays
    });
    sum += concated[i].maxLoanValue;
    i += 1;
  }

  sum = 0;
  i = 0;

  while (sum < minValue && i < concated.length) {
    safest.push({
      nftMint: concated[i].nftMint,
      loanValue: concated[i].minLoanValue,
      interest: concated[i].interest,
      amountOfDays: concated[i].amountOfDays
    });
    sum += concated[i].minLoanValue;
    i += 1;
  }

  i = 0;

  while (sum < minValue && i < concated.length) {
    sum += (concated[i].maxLoanValue - cheapest[i].loanValue);
    cheapest[i].loanValue = concated[i].maxLoanValue;
    i += 1;
  }

  return {
    best,
    safest,
    cheapest,
  }
};
