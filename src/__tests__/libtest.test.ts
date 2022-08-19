import { getMostOptimalLoansClosestToNeededSolInBulk } from '../loans';

// @ts-ignore
jest.setTimeout(1000000000);

// @ts-ignore
test('Examples', async () => {
  //   console.log('tests are working');
  testOfBulkLoansAlgorithm();
});

const testOfBulkLoansAlgorithm = () => {
  const multiplier = 1e9;
  const possibleLoans = [
    { nftMint: 'string', loanValue: 132 * multiplier, interest: 2 },
    { nftMint: 'string', loanValue: 52 * multiplier, interest: 20 },
    { nftMint: 'string', loanValue: 101 * multiplier, interest: 4 },
    { nftMint: 'string', loanValue: 242 * multiplier, interest: 1 },
    { nftMint: 'string', loanValue: 20 * multiplier, interest: 2 },
    { nftMint: 'string', loanValue: 3 * multiplier, interest: 1 },
  ];
  //   const possibleLoans = [
  //     { nftMint: 'string', loanValue: 132 , interest: 2  },
  //     { nftMint: 'string', loanValue: 52 , interest: 20  },
  //     { nftMint: 'string', loanValue: 101 , interest: 4  },
  //     { nftMint: 'string', loanValue: 242 , interest: 1  },
  //     { nftMint: 'string', loanValue: 20 , interest: 2  },
  //     { nftMint: 'string', loanValue: 3 , interest: 0.5  },
  //   ];

  const neededSol = 400 * multiplier;
  console.log('neededSol: ', neededSol);
  console.log(
    getMostOptimalLoansClosestToNeededSolInBulk({
      neededSol,
      possibleLoans,
    }),
  );
};
