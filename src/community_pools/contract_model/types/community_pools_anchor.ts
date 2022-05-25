export type CommunityPoolsAnchor = {
  version: '0.1.0';
  name: 'community_pools_anchor';
  instructions: [
    {
      name: 'initPool';
      accounts: [
        {
          name: 'communityPool';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'addToWhitelist';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'poolWhitelist';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'isCreator';
          type: 'bool';
        },
      ];
      returns: null;
    },
    {
      name: 'activatePool';
      accounts: [
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: null;
    },
    {
      name: 'depositNft';
      accounts: [
        {
          name: 'safetyDepositBox';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'storeNftTokenAccount';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userFractionsTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'poolWhitelist';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'metadataInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenMintInput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fusionVaultOwnerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAccountOutput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mainRouter';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'configOutput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fusionId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'feeConfig';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'boardEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'leaderboardAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminTokenAccount';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
        {
          name: 'bumpTopupAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'getLotteryTicket';
      accounts: [
        {
          name: 'lotteryTicket';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userFractionsTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMintInput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fusionVaultOwnerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAccountOutput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mainRouter';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'configOutput';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fusionId';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'feeConfig';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'boardEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'leaderboardAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminTokenAccount';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpTopupAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'revealLotteryTicket';
      accounts: [
        {
          name: 'lotteryTicket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyDepositBox';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [];
      returns: null;
    },
    {
      name: 'withdrawNftByTicket';
      accounts: [
        {
          name: 'lotteryTicket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyDepositBox';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'storeNftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'withdrawNftByAdmin';
      accounts: [
        {
          name: 'lotteryTicket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'safetyDepositBox';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'storeNftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'initializeLeaderboard';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'leaderboardAccount';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'depositReward';
          type: 'u64';
        },
        {
          name: 'withdrawReward';
          type: 'u64';
        },
      ];
      returns: null;
    },
    {
      name: 'updateLeaderboard';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'leaderboardAccount';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpLeaderboard';
          type: 'u8';
        },
        {
          name: 'depositReward';
          type: 'u64';
        },
        {
          name: 'withdrawReward';
          type: 'u64';
        },
      ];
      returns: null;
    },
    {
      name: 'initializeFee';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPool';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'depositFeeAdmin';
          type: 'u32';
        },
        {
          name: 'depositFeePool';
          type: 'u32';
        },
        {
          name: 'getLotteryFeeAdmin';
          type: 'u32';
        },
        {
          name: 'getLotteryFeePool';
          type: 'u32';
        },
      ];
      returns: null;
    },
    {
      name: 'updateFee';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'depositFeeAdmin';
          type: 'u32';
        },
        {
          name: 'depositFeePool';
          type: 'u32';
        },
        {
          name: 'getLotteryFeeAdmin';
          type: 'u32';
        },
        {
          name: 'getLotteryFeePool';
          type: 'u32';
        },
      ];
      returns: null;
    },
    {
      name: 'addScore';
      accounts: [
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'programAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'boardEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'permission';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPermission';
          type: 'u8';
        },
        {
          name: 'bumpBoard';
          type: 'u8';
        },
        {
          name: 'programPubkey';
          type: 'publicKey';
        },
        {
          name: 'toAdd';
          type: 'u64';
        },
      ];
      returns: null;
    },
    {
      name: 'harvestScore';
      accounts: [
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultOwnerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'boardEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpBoard';
          type: 'u8';
        },
        {
          name: 'bumpAuth';
          type: 'u8';
        },
        {
          name: 'bumpConfig';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'initializeBoardEntry';
      accounts: [
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'boardEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'totalScore';
          type: 'u64';
        },
        {
          name: 'message';
          type: 'string';
        },
      ];
      returns: null;
    },
    {
      name: 'initializePermission';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'programPubkey';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'permission';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'expiration';
          type: 'u64';
        },
        {
          name: 'add';
          type: 'bool';
        },
        {
          name: 'harvest';
          type: 'bool';
        },
      ];
      returns: null;
    },
    {
      name: 'intializeConfig';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultOwnerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'topupConfig';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultOwnerPda';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpAuth';
          type: 'u8';
        },
        {
          name: 'bumpConfig';
          type: 'u8';
        },
        {
          name: 'topupAmount';
          type: 'u64';
        },
      ];
      returns: null;
    },
    {
      name: 'updateConnection';
      accounts: [
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'fractionMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'router';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: null;
    },
    {
      name: 'emergencyWithdrawByAdmin';
      accounts: [
        {
          name: 'safetyDepositBox';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'storeNftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
      returns: null;
    },
    {
      name: 'removeFromWhitelistByAdmin';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'poolWhitelist';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: null;
    },
  ];
  accounts: [
    {
      name: 'boardEntry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'entryholder';
            type: 'publicKey';
          },
          {
            name: 'totalScore';
            type: 'u64';
          },
          {
            name: 'scoreToHarvest';
            type: 'u64';
          },
          {
            name: 'nftMint';
            type: 'publicKey';
          },
          {
            name: 'message';
            type: 'string';
          },
        ];
      };
    },
    {
      name: 'communityPool';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenProgram';
            type: 'publicKey';
          },
          {
            name: 'fractionMint';
            type: 'publicKey';
          },
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'fractionsSupply';
            type: 'u64';
          },
          {
            name: 'createdAt';
            type: 'u64';
          },
          {
            name: 'tokenTypeCount';
            type: 'u64';
          },
          {
            name: 'state';
            type: {
              defined: 'VaultState';
            };
          },
        ];
      };
    },
    {
      name: 'feeConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'communityPool';
            type: 'publicKey';
          },
          {
            name: 'depositFeeAdmin';
            type: 'u64';
          },
          {
            name: 'depositFeePool';
            type: 'u64';
          },
          {
            name: 'getLotteryFeeAdmin';
            type: 'u64';
          },
          {
            name: 'getLotteryFeePool';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'poolConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'vaultOwnerPda';
            type: 'publicKey';
          },
          {
            name: 'tokenMint';
            type: 'publicKey';
          },
          {
            name: 'vaultTokenAccount';
            type: 'publicKey';
          },
          {
            name: 'poolVaultBalance';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'leaderboardRewardAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'communityPool';
            type: 'publicKey';
          },
          {
            name: 'depositReward';
            type: 'u64';
          },
          {
            name: 'withdrawReward';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'lotteryTicket';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'communityPool';
            type: 'publicKey';
          },
          {
            name: 'ticketHolder';
            type: 'publicKey';
          },
          {
            name: 'winningSafetyBox';
            type: 'publicKey';
          },
          {
            name: 'lotteryTicketState';
            type: {
              defined: 'LotteryTicketState';
            };
          },
        ];
      };
    },
    {
      name: 'permission';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'programPubkey';
            type: 'publicKey';
          },
          {
            name: 'expiration';
            type: 'u64';
          },
          {
            name: 'canAddScore';
            type: 'bool';
          },
          {
            name: 'canHarvestScore';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'poolWhitelist';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'communityPool';
            type: 'publicKey';
          },
          {
            name: 'whitelistedAddress';
            type: 'publicKey';
          },
          {
            name: 'whitelistType';
            type: {
              defined: 'WhitelistType';
            };
          },
        ];
      };
    },
    {
      name: 'safetyDepositBox';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'communityPool';
            type: 'publicKey';
          },
          {
            name: 'nftMint';
            type: 'publicKey';
          },
          {
            name: 'storeNftTokenAccount';
            type: 'publicKey';
          },
          {
            name: 'safetyBoxState';
            type: {
              defined: 'SafetyBoxState';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'VaultState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Inactive';
          },
          {
            name: 'Active';
          },
          {
            name: 'Deactivated';
          },
        ];
      };
    },
    {
      name: 'LotteryTicketState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'ToBeRevealed';
          },
          {
            name: 'Revealed';
          },
          {
            name: 'Used';
          },
        ];
      };
    },
    {
      name: 'WhitelistType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'CreatorWhitelist';
          },
          {
            name: 'SingleNFTWhitelist';
          },
        ];
      };
    },
    {
      name: 'SafetyBoxState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Locked';
          },
          {
            name: 'Empty';
          },
          {
            name: 'ToBeWithdrawn';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'CommunityPoolAuthorityDoesntMatch';
      msg: "Community pool authority doesn't match actual authority";
    },
    {
      code: 6001;
      name: 'PoolIsAlreadyActivated';
      msg: 'Pool is already activated';
    },
    {
      code: 6002;
      name: 'NotWhitelisted';
      msg: 'Nft or creator is not whitelisted';
    },
    {
      code: 6003;
      name: 'WrongMetadata';
      msg: 'Wrong metadata';
    },
    {
      code: 6004;
      name: 'InvalidAuthority';
      msg: 'Invalid Authority';
    },
    {
      code: 6005;
      name: 'InvalidBoardEntry';
      msg: 'Invalid BoardEntry';
    },
  ];
};

export const IDL: CommunityPoolsAnchor = {
  version: '0.1.0',
  name: 'community_pools_anchor',
  instructions: [
    {
      name: 'initPool',
      accounts: [
        {
          name: 'communityPool',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'communityPoolsAuthority',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpPoolsAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'addToWhitelist',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'poolWhitelist',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedAddress',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'isCreator',
          type: 'bool',
        },
      ],
      returns: null,
    },
    {
      name: 'activatePool',
      accounts: [
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: null,
    },
    {
      name: 'depositNft',
      accounts: [
        {
          name: 'safetyDepositBox',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nftUserTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'storeNftTokenAccount',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPoolsAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userFractionsTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'poolWhitelist',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'metadataInfo',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenMintInput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fusionVaultOwnerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccountOutput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mainRouter',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'configOutput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fusionId',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'feeConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'boardEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'leaderboardAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminTokenAccount',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpPoolsAuth',
          type: 'u8',
        },
        {
          name: 'bumpTopupAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'getLotteryTicket',
      accounts: [
        {
          name: 'lotteryTicket',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userFractionsTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenMintInput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fusionVaultOwnerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccountOutput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mainRouter',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'configOutput',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fusionId',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'feeConfig',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'boardEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'leaderboardAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminTokenAccount',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpTopupAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'revealLotteryTicket',
      accounts: [
        {
          name: 'lotteryTicket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyDepositBox',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
      returns: null,
    },
    {
      name: 'withdrawNftByTicket',
      accounts: [
        {
          name: 'lotteryTicket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyDepositBox',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftUserTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'storeNftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPoolsAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpPoolsAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'withdrawNftByAdmin',
      accounts: [
        {
          name: 'lotteryTicket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'safetyDepositBox',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftUserTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'storeNftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPoolsAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'bumpPoolsAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'initializeLeaderboard',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'leaderboardAccount',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'depositReward',
          type: 'u64',
        },
        {
          name: 'withdrawReward',
          type: 'u64',
        },
      ],
      returns: null,
    },
    {
      name: 'updateLeaderboard',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'leaderboardAccount',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpLeaderboard',
          type: 'u8',
        },
        {
          name: 'depositReward',
          type: 'u64',
        },
        {
          name: 'withdrawReward',
          type: 'u64',
        },
      ],
      returns: null,
    },
    {
      name: 'initializeFee',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'communityPool',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'depositFeeAdmin',
          type: 'u32',
        },
        {
          name: 'depositFeePool',
          type: 'u32',
        },
        {
          name: 'getLotteryFeeAdmin',
          type: 'u32',
        },
        {
          name: 'getLotteryFeePool',
          type: 'u32',
        },
      ],
      returns: null,
    },
    {
      name: 'updateFee',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'depositFeeAdmin',
          type: 'u32',
        },
        {
          name: 'depositFeePool',
          type: 'u32',
        },
        {
          name: 'getLotteryFeeAdmin',
          type: 'u32',
        },
        {
          name: 'getLotteryFeePool',
          type: 'u32',
        },
      ],
      returns: null,
    },
    {
      name: 'addScore',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'programAuthority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'boardEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'permission',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpPermission',
          type: 'u8',
        },
        {
          name: 'bumpBoard',
          type: 'u8',
        },
        {
          name: 'programPubkey',
          type: 'publicKey',
        },
        {
          name: 'toAdd',
          type: 'u64',
        },
      ],
      returns: null,
    },
    {
      name: 'harvestScore',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultOwnerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'boardEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpBoard',
          type: 'u8',
        },
        {
          name: 'bumpAuth',
          type: 'u8',
        },
        {
          name: 'bumpConfig',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'initializeBoardEntry',
      accounts: [
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'boardEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'totalScore',
          type: 'u64',
        },
        {
          name: 'message',
          type: 'string',
        },
      ],
      returns: null,
    },
    {
      name: 'initializePermission',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'programPubkey',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'permission',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'expiration',
          type: 'u64',
        },
        {
          name: 'add',
          type: 'bool',
        },
        {
          name: 'harvest',
          type: 'bool',
        },
      ],
      returns: null,
    },
    {
      name: 'intializeConfig',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultOwnerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'topupConfig',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultOwnerPda',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bumpAuth',
          type: 'u8',
        },
        {
          name: 'bumpConfig',
          type: 'u8',
        },
        {
          name: 'topupAmount',
          type: 'u64',
        },
      ],
      returns: null,
    },
    {
      name: 'updateConnection',
      accounts: [
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'fractionMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'router',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: null,
    },
    {
      name: 'emergencyWithdrawByAdmin',
      accounts: [
        {
          name: 'safetyDepositBox',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftUserTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'storeNftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPool',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'communityPoolsAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'bumpPoolsAuth',
          type: 'u8',
        },
      ],
      returns: null,
    },
    {
      name: 'removeFromWhitelistByAdmin',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'poolWhitelist',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedAddress',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: null,
    },
  ],
  accounts: [
    {
      name: 'boardEntry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'entryholder',
            type: 'publicKey',
          },
          {
            name: 'totalScore',
            type: 'u64',
          },
          {
            name: 'scoreToHarvest',
            type: 'u64',
          },
          {
            name: 'nftMint',
            type: 'publicKey',
          },
          {
            name: 'message',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'communityPool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokenProgram',
            type: 'publicKey',
          },
          {
            name: 'fractionMint',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'fractionsSupply',
            type: 'u64',
          },
          {
            name: 'createdAt',
            type: 'u64',
          },
          {
            name: 'tokenTypeCount',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'VaultState',
            },
          },
        ],
      },
    },
    {
      name: 'feeConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'communityPool',
            type: 'publicKey',
          },
          {
            name: 'depositFeeAdmin',
            type: 'u64',
          },
          {
            name: 'depositFeePool',
            type: 'u64',
          },
          {
            name: 'getLotteryFeeAdmin',
            type: 'u64',
          },
          {
            name: 'getLotteryFeePool',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'poolConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'vaultOwnerPda',
            type: 'publicKey',
          },
          {
            name: 'tokenMint',
            type: 'publicKey',
          },
          {
            name: 'vaultTokenAccount',
            type: 'publicKey',
          },
          {
            name: 'poolVaultBalance',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'leaderboardRewardAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'communityPool',
            type: 'publicKey',
          },
          {
            name: 'depositReward',
            type: 'u64',
          },
          {
            name: 'withdrawReward',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'lotteryTicket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'communityPool',
            type: 'publicKey',
          },
          {
            name: 'ticketHolder',
            type: 'publicKey',
          },
          {
            name: 'winningSafetyBox',
            type: 'publicKey',
          },
          {
            name: 'lotteryTicketState',
            type: {
              defined: 'LotteryTicketState',
            },
          },
        ],
      },
    },
    {
      name: 'permission',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'programPubkey',
            type: 'publicKey',
          },
          {
            name: 'expiration',
            type: 'u64',
          },
          {
            name: 'canAddScore',
            type: 'bool',
          },
          {
            name: 'canHarvestScore',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'poolWhitelist',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'communityPool',
            type: 'publicKey',
          },
          {
            name: 'whitelistedAddress',
            type: 'publicKey',
          },
          {
            name: 'whitelistType',
            type: {
              defined: 'WhitelistType',
            },
          },
        ],
      },
    },
    {
      name: 'safetyDepositBox',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'communityPool',
            type: 'publicKey',
          },
          {
            name: 'nftMint',
            type: 'publicKey',
          },
          {
            name: 'storeNftTokenAccount',
            type: 'publicKey',
          },
          {
            name: 'safetyBoxState',
            type: {
              defined: 'SafetyBoxState',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'VaultState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Inactive',
          },
          {
            name: 'Active',
          },
          {
            name: 'Deactivated',
          },
        ],
      },
    },
    {
      name: 'LotteryTicketState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'ToBeRevealed',
          },
          {
            name: 'Revealed',
          },
          {
            name: 'Used',
          },
        ],
      },
    },
    {
      name: 'WhitelistType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'CreatorWhitelist',
          },
          {
            name: 'SingleNFTWhitelist',
          },
        ],
      },
    },
    {
      name: 'SafetyBoxState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Locked',
          },
          {
            name: 'Empty',
          },
          {
            name: 'ToBeWithdrawn',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'CommunityPoolAuthorityDoesntMatch',
      msg: "Community pool authority doesn't match actual authority",
    },
    {
      code: 6001,
      name: 'PoolIsAlreadyActivated',
      msg: 'Pool is already activated',
    },
    {
      code: 6002,
      name: 'NotWhitelisted',
      msg: 'Nft or creator is not whitelisted',
    },
    {
      code: 6003,
      name: 'WrongMetadata',
      msg: 'Wrong metadata',
    },
    {
      code: 6004,
      name: 'InvalidAuthority',
      msg: 'Invalid Authority',
    },
    {
      code: 6005,
      name: 'InvalidBoardEntry',
      msg: 'Invalid BoardEntry',
    },
  ],
};
