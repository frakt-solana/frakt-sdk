export type NftLendingV2 = {
  "version": "0.1.0",
  "name": "nft_lending_v2",
  "instructions": [
    {
      "name": "proposeLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPriceBased",
          "type": "bool"
        },
        {
          "name": "originalPriceFromUser",
          "type": "u64"
        },
        {
          "name": "loanToValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "approveLoanByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nftPrice",
          "type": "u64"
        },
        {
          "name": "discount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeCollectionInfo",
      "accounts": [
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creatorAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pricingLookupAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectionInfoParams"
          }
        }
      ]
    },
    {
      "name": "updateCollectionInfo",
      "accounts": [
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creatorAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pricingLookupAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectionInfoParams"
          }
        }
      ]
    },
    {
      "name": "initializePriceBasedLiquidityPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PriceBasedLiqPoolInputParams"
          }
        }
      ]
    },
    {
      "name": "updatePriceBasedLiquidityPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PriceBasedLiqPoolInputParams"
          }
        }
      ]
    },
    {
      "name": "paybackLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rejectLoanByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvestLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "liquidateNftToRaffles",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gracePeriod",
          "type": "u64"
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "paybackWithGrace",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawFromReserveFund",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stopLiquidationRafflesByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAdminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "putLoanToLiquidationRaffles",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAdminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "gracePeriod",
          "type": "u64"
        }
      ]
    },
    {
      "name": "returnFromGraceToActive",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "userReturnLoanFromEscrow",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "CHECK"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "stakeCardinal",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingStake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityStakeMintTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMintMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cardinalStakeCenter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeCardinal",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingStake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityStakeMintTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cardinalStakeCenter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "topupLiqPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstakeLiquidityHarvest",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rejectLoanByAdminNoLoan",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "proposeLoanNew",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPriceBased",
          "type": "bool"
        },
        {
          "name": "originalPriceFromUser",
          "type": "u64"
        },
        {
          "name": "loanToValue",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collectionInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "pricingLookupAddress",
            "type": "publicKey"
          },
          {
            "name": "royaltyAddress",
            "type": "publicKey"
          },
          {
            "name": "royaltyFeeTime",
            "type": "u64"
          },
          {
            "name": "royaltyFeePrice",
            "type": "u64"
          },
          {
            "name": "loanToValue",
            "type": "u64"
          },
          {
            "name": "collaterizationRate",
            "type": "u64"
          },
          {
            "name": "availableLoanTypes",
            "type": {
              "defined": "AvailableLoanTypes"
            }
          },
          {
            "name": "expirationTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "comPools",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "stakedAtCumulative",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lendingStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeType",
            "type": {
              "defined": "StakeType"
            }
          },
          {
            "name": "loan",
            "type": "publicKey"
          },
          {
            "name": "stakeContract",
            "type": "publicKey"
          },
          {
            "name": "stakeContractOptional",
            "type": "publicKey"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          },
          {
            "name": "identity",
            "type": "publicKey"
          },
          {
            "name": "dataA",
            "type": "publicKey"
          },
          {
            "name": "dataB",
            "type": "publicKey"
          },
          {
            "name": "dataC",
            "type": "publicKey"
          },
          {
            "name": "dataD",
            "type": "publicKey"
          },
          {
            "name": "totalHarvested",
            "type": "u64"
          },
          {
            "name": "totalHarvestedOptional",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidationLot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loan",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "vaultNftTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lotNoFeesPrice",
            "type": "u64"
          },
          {
            "name": "winningChanceInBasePoints",
            "type": "u64"
          },
          {
            "name": "startedAt",
            "type": "u64"
          },
          {
            "name": "endingAt",
            "type": "u64"
          },
          {
            "name": "lotState",
            "type": {
              "defined": "LotState"
            }
          },
          {
            "name": "ticketsCount",
            "type": "u64"
          },
          {
            "name": "gracePeriod",
            "type": "u64"
          },
          {
            "name": "graceFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "loan",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "nftUserTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "collectionInfo",
            "type": "publicKey"
          },
          {
            "name": "startedAt",
            "type": "u64"
          },
          {
            "name": "expiredAt",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "finishedAt",
            "type": "u64"
          },
          {
            "name": "originalPrice",
            "type": "u64"
          },
          {
            "name": "amountToGet",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "royaltyAmount",
            "type": "u64"
          },
          {
            "name": "rewardInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "feeInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "royaltyInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "loanStatus",
            "type": {
              "defined": "LoanStatus"
            }
          },
          {
            "name": "loanType",
            "type": {
              "defined": "LoanType"
            }
          }
        ]
      }
    },
    {
      "name": "priceBasedLiquidityPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "baseBorrowRate",
            "type": "u32"
          },
          {
            "name": "variableSlope1",
            "type": "u32"
          },
          {
            "name": "variableSlope2",
            "type": "u32"
          },
          {
            "name": "utilizationRateOptimal",
            "type": "u32"
          },
          {
            "name": "reserveFactor",
            "type": "u32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "liquidityAmount",
            "type": "u64"
          },
          {
            "name": "liqOwner",
            "type": "publicKey"
          },
          {
            "name": "liqSeed",
            "type": "u8"
          },
          {
            "name": "amountOfStaked",
            "type": "u64"
          },
          {
            "name": "depositApr",
            "type": "u64"
          },
          {
            "name": "borrowApr",
            "type": "u64"
          },
          {
            "name": "borrowCumulative",
            "type": "u64"
          },
          {
            "name": "depositCumulative",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          },
          {
            "name": "borrowCommission",
            "type": "u32"
          },
          {
            "name": "depositCommission",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "liquidityPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "rewardInterestRateTime",
            "type": "u64"
          },
          {
            "name": "feeInterestRateTime",
            "type": "u64"
          },
          {
            "name": "rewardInterestRatePrice",
            "type": "u64"
          },
          {
            "name": "feeInterestRatePrice",
            "type": "u64"
          },
          {
            "name": "liquidityAmount",
            "type": "u64"
          },
          {
            "name": "liqOwner",
            "type": "publicKey"
          },
          {
            "name": "liqSeed",
            "type": "u8"
          },
          {
            "name": "amountOfStaked",
            "type": "u64"
          },
          {
            "name": "userRewardsAmount",
            "type": "u64"
          },
          {
            "name": "apr",
            "type": "u64"
          },
          {
            "name": "cumulative",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          },
          {
            "name": "oldCumulative",
            "type": "u64"
          },
          {
            "name": "period",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CollectionInfoParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loanToValue",
            "type": "u64"
          },
          {
            "name": "collaterizationRate",
            "type": "u64"
          },
          {
            "name": "royaltyFeeTime",
            "type": "u64"
          },
          {
            "name": "royaltyFeePrice",
            "type": "u64"
          },
          {
            "name": "expirationTime",
            "type": "u64"
          },
          {
            "name": "isPriceBased",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PriceBasedLiqPoolInputParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "baseBorrowRate",
            "type": "u32"
          },
          {
            "name": "variableSlope1",
            "type": "u32"
          },
          {
            "name": "variableSlope2",
            "type": "u32"
          },
          {
            "name": "utilizationRateOptimal",
            "type": "u32"
          },
          {
            "name": "reserveFactor",
            "type": "u32"
          },
          {
            "name": "borrowCommission",
            "type": "u32"
          },
          {
            "name": "depositCommission",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "AuthorizationDataLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payload",
            "type": {
              "vec": {
                "defined": "TaggedPayload"
              }
            }
          }
        ]
      }
    },
    {
      "name": "TaggedPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payload",
            "type": {
              "defined": "PayloadTypeLocal"
            }
          }
        ]
      }
    },
    {
      "name": "SeedsVecLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seeds",
            "docs": [
              "The vector of derivation seeds."
            ],
            "type": {
              "vec": "bytes"
            }
          }
        ]
      }
    },
    {
      "name": "ProofInfoLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proof",
            "docs": [
              "The merkle proof."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "AvailableLoanTypes",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OnlyTimeBased"
          },
          {
            "name": "OnlyPriceBased"
          }
        ]
      }
    },
    {
      "name": "StakeType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "DeGods"
          },
          {
            "name": "GemWorksNewest"
          },
          {
            "name": "Cets"
          }
        ]
      }
    },
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unstaked"
          },
          {
            "name": "Staked"
          }
        ]
      }
    },
    {
      "name": "LotState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotActive"
          },
          {
            "name": "Active"
          },
          {
            "name": "Redeemed"
          },
          {
            "name": "PaidBackWithGrace"
          }
        ]
      }
    },
    {
      "name": "LoanStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Proposed"
          },
          {
            "name": "Rejected"
          },
          {
            "name": "Activated"
          },
          {
            "name": "PaidBack"
          },
          {
            "name": "Liquidated"
          },
          {
            "name": "PaidBackWithGrace"
          }
        ]
      }
    },
    {
      "name": "LoanType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TimeBased"
          },
          {
            "name": "PriceBased"
          }
        ]
      }
    },
    {
      "name": "PayloadTypeLocal",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pubkey",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "Seeds",
            "fields": [
              {
                "defined": "SeedsVecLocal"
              }
            ]
          },
          {
            "name": "MerkleProof",
            "fields": [
              {
                "defined": "ProofInfoLocal"
              }
            ]
          },
          {
            "name": "Number",
            "fields": [
              "u64"
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "LoanUpdate",
      "fields": [
        {
          "name": "loan",
          "type": "string",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "LoanStatus"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInstruction",
      "msg": "InvalidInstruction"
    },
    {
      "code": 6001,
      "name": "MoreThanHave",
      "msg": "MoreThanHave"
    },
    {
      "code": 6002,
      "name": "LoanIsNotProposed",
      "msg": "LoanIsNotProposed"
    },
    {
      "code": 6003,
      "name": "CollectionInfoDoNotConnectWithNftMint",
      "msg": "CollectionInfoDoNotConnectWithNftMint"
    },
    {
      "code": 6004,
      "name": "IncorrectNftMint",
      "msg": "IncorrectNftMint"
    },
    {
      "code": 6005,
      "name": "IncorrectTokenAccount",
      "msg": "IncorrectTokenAccount"
    },
    {
      "code": 6006,
      "name": "LoanIsNotActivated",
      "msg": "LoanIsNotActivated"
    },
    {
      "code": 6007,
      "name": "LoanIsNotLiquidated",
      "msg": "LoanIsNotLiquidated"
    },
    {
      "code": 6008,
      "name": "TimeIsExpired",
      "msg": "TimeIsExpired"
    },
    {
      "code": 6009,
      "name": "CollectionInfoDoesntMatchLiquidityPool",
      "msg": "CollectionInfoDoesntMatchLiquidityPool"
    },
    {
      "code": 6010,
      "name": "CannotClose",
      "msg": "CannotClose"
    },
    {
      "code": 6011,
      "name": "WrongTypeOfAvailableLoan",
      "msg": "WrongTypeOfAvailableLoan"
    },
    {
      "code": 6012,
      "name": "InvalidLoan",
      "msg": "InvalidLoan"
    },
    {
      "code": 6013,
      "name": "NftsAttemptsAreUsed",
      "msg": "NftsAttemptsAreUsed"
    },
    {
      "code": 6014,
      "name": "GracePeriodNotEnded",
      "msg": "GracePeriodNotEnded"
    },
    {
      "code": 6015,
      "name": "GracePerionIsAlreadyEnded",
      "msg": "GracePerionIsAlreadyEnded"
    },
    {
      "code": 6016,
      "name": "LotIsAlreadyEnded",
      "msg": "LotIsAlreadyEnded"
    },
    {
      "code": 6017,
      "name": "LotIsNotLiquidatedYet",
      "msg": "LotIsNotLiquidatedYet"
    },
    {
      "code": 6018,
      "name": "TicketIsRevealedOrRejected",
      "msg": "TicketIsRevealedOrRejected"
    },
    {
      "code": 6019,
      "name": "TicketIsNotWinning",
      "msg": "TicketIsNotWinning"
    },
    {
      "code": 6020,
      "name": "WrongLiqPool",
      "msg": "WrongLiqPool"
    },
    {
      "code": 6021,
      "name": "WrongLiqOwner",
      "msg": "WrongLiqOwner"
    },
    {
      "code": 6022,
      "name": "WrongUserOnLoan",
      "msg": "WrongUserOnLoan"
    },
    {
      "code": 6023,
      "name": "WrongAdmin",
      "msg": "WrongAdmin"
    },
    {
      "code": 6024,
      "name": "WrongNftMintOnLoan",
      "msg": "WrongNftMintOnLoan"
    },
    {
      "code": 6025,
      "name": "WrongLoanOnLiquidationLot",
      "msg": "WrongLoanOnLiquidationLot"
    },
    {
      "code": 6026,
      "name": "WrongNftMintOnLiquidationLot",
      "msg": "WrongNftMintOnLiquidationLot"
    },
    {
      "code": 6027,
      "name": "WrongNftMintOnNftAttempts",
      "msg": "WrongNftMintOnNftAttempts"
    },
    {
      "code": 6028,
      "name": "WrongLiqPoolOnDeposit",
      "msg": "WrongLiqPoolOnDeposit"
    },
    {
      "code": 6029,
      "name": "WrongUserOnDeposit",
      "msg": "WrongUserOnDeposit"
    },
    {
      "code": 6030,
      "name": "WrongTokenAccountOnLoan",
      "msg": "WrongTokenAccountOnLoan"
    },
    {
      "code": 6031,
      "name": "WrongLiquidator",
      "msg": "WrongLiquidator"
    },
    {
      "code": 6032,
      "name": "WrongRoyaltyAddressOnCollectionInfo",
      "msg": "WrongRoyaltyAddressOnCollectionInfo"
    },
    {
      "code": 6033,
      "name": "WrongLiqPoolOnCollectionInfo",
      "msg": "WrongLiqPoolOnCollectionInfo"
    },
    {
      "code": 6034,
      "name": "WrongCollectionInfoOnLoan",
      "msg": "WrongCollectionInfoOnLoan"
    },
    {
      "code": 6035,
      "name": "WrongLiqPoolOnLoan",
      "msg": "WrongLiqPoolOnLoan"
    },
    {
      "code": 6036,
      "name": "WrongVaultAccountOnLiquidationLot",
      "msg": "WrongVaultAccountOnLiquidationLot"
    },
    {
      "code": 6037,
      "name": "WrongLiqLotOnLotTicket",
      "msg": "WrongLiqLotOnLotTicket"
    },
    {
      "code": 6038,
      "name": "WrongUserOnLotTicket",
      "msg": "WrongUserOnLotTicket"
    },
    {
      "code": 6039,
      "name": "LotStateIsNotActive",
      "msg": "LotStateIsNotActive"
    },
    {
      "code": 6040,
      "name": "WrongLoanToValue",
      "msg": "WrongLoanToValue"
    },
    {
      "code": 6041,
      "name": "FunctionIsNotSupportedForNow",
      "msg": "Function is not supported right now"
    },
    {
      "code": 6042,
      "name": "CantSetLtvMoreThanNftValue",
      "msg": "Can't set loan to value more than 100%"
    },
    {
      "code": 6043,
      "name": "FraktNftStakeNotInitialized",
      "msg": "FraktNftStakeNotInitialized"
    },
    {
      "code": 6044,
      "name": "FraktNftNotStaked",
      "msg": "FraktNftNotStaked"
    },
    {
      "code": 6045,
      "name": "FraktNftStakeOwnerDoesntMatch",
      "msg": "FraktNftStakeOwnerDoesntMatch"
    },
    {
      "code": 6046,
      "name": "TokenAccountDoesntContainNft",
      "msg": "TokenAccountDoesntContainNft"
    },
    {
      "code": 6047,
      "name": "StakingAccountDoesntMatchAttemptsNftMint",
      "msg": "StakingAccountDoesntMatchAttemptsNftMint"
    },
    {
      "code": 6048,
      "name": "UserDoesntOwnStake",
      "msg": "UserDoesntOwnStake"
    },
    {
      "code": 6049,
      "name": "BadRuleSet",
      "msg": "BadRuleSetForProgrammableNft"
    },
    {
      "code": 6050,
      "name": "DelegateBuilderFailed",
      "msg": "DelegateBuilderFailed"
    },
    {
      "code": 6051,
      "name": "LockBuilderFailed",
      "msg": "LockBuilderFailed"
    },
    {
      "code": 6052,
      "name": "NoStandardOnNft",
      "msg": "NoStandardOnNft"
    },
    {
      "code": 6053,
      "name": "OldPerpetualsAreDisabled",
      "msg": "OldPerpetualsAreDisabled"
    }
  ]
};

export const IDL: NftLendingV2 = {
  "version": "0.1.0",
  "name": "nft_lending_v2",
  "instructions": [
    {
      "name": "proposeLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPriceBased",
          "type": "bool"
        },
        {
          "name": "originalPriceFromUser",
          "type": "u64"
        },
        {
          "name": "loanToValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "approveLoanByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nftPrice",
          "type": "u64"
        },
        {
          "name": "discount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeCollectionInfo",
      "accounts": [
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creatorAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pricingLookupAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectionInfoParams"
          }
        }
      ]
    },
    {
      "name": "updateCollectionInfo",
      "accounts": [
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creatorAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pricingLookupAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectionInfoParams"
          }
        }
      ]
    },
    {
      "name": "initializePriceBasedLiquidityPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PriceBasedLiqPoolInputParams"
          }
        }
      ]
    },
    {
      "name": "updatePriceBasedLiquidityPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PriceBasedLiqPoolInputParams"
          }
        }
      ]
    },
    {
      "name": "paybackLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rejectLoanByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvestLiquidity",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "liquidateNftToRaffles",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gracePeriod",
          "type": "u64"
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "paybackWithGrace",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "royaltyAddress",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawFromReserveFund",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stopLiquidationRafflesByAdmin",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAdminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "putLoanToLiquidationRaffles",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAdminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "gracePeriod",
          "type": "u64"
        }
      ]
    },
    {
      "name": "returnFromGraceToActive",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidationLot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "userReturnLoanFromEscrow",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeLoan",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "CHECK"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "stakeCardinal",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingStake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityStakeMintTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMintMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cardinalStakeCenter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeCardinal",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingStake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loan",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityStakeMintTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEntry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identityEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cardinalStakeCenter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "topupLiqPool",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unstakeLiquidityHarvest",
      "accounts": [
        {
          "name": "liquidityPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "liqOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rejectLoanByAdminNoLoan",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "proposeLoanNew",
      "accounts": [
        {
          "name": "loan",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityPoolsAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecordInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isPriceBased",
          "type": "bool"
        },
        {
          "name": "originalPriceFromUser",
          "type": "u64"
        },
        {
          "name": "loanToValue",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collectionInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "pricingLookupAddress",
            "type": "publicKey"
          },
          {
            "name": "royaltyAddress",
            "type": "publicKey"
          },
          {
            "name": "royaltyFeeTime",
            "type": "u64"
          },
          {
            "name": "royaltyFeePrice",
            "type": "u64"
          },
          {
            "name": "loanToValue",
            "type": "u64"
          },
          {
            "name": "collaterizationRate",
            "type": "u64"
          },
          {
            "name": "availableLoanTypes",
            "type": {
              "defined": "AvailableLoanTypes"
            }
          },
          {
            "name": "expirationTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "comPools",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "stakedAtCumulative",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lendingStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeType",
            "type": {
              "defined": "StakeType"
            }
          },
          {
            "name": "loan",
            "type": "publicKey"
          },
          {
            "name": "stakeContract",
            "type": "publicKey"
          },
          {
            "name": "stakeContractOptional",
            "type": "publicKey"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          },
          {
            "name": "identity",
            "type": "publicKey"
          },
          {
            "name": "dataA",
            "type": "publicKey"
          },
          {
            "name": "dataB",
            "type": "publicKey"
          },
          {
            "name": "dataC",
            "type": "publicKey"
          },
          {
            "name": "dataD",
            "type": "publicKey"
          },
          {
            "name": "totalHarvested",
            "type": "u64"
          },
          {
            "name": "totalHarvestedOptional",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidationLot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loan",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "vaultNftTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lotNoFeesPrice",
            "type": "u64"
          },
          {
            "name": "winningChanceInBasePoints",
            "type": "u64"
          },
          {
            "name": "startedAt",
            "type": "u64"
          },
          {
            "name": "endingAt",
            "type": "u64"
          },
          {
            "name": "lotState",
            "type": {
              "defined": "LotState"
            }
          },
          {
            "name": "ticketsCount",
            "type": "u64"
          },
          {
            "name": "gracePeriod",
            "type": "u64"
          },
          {
            "name": "graceFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "loan",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "nftUserTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "liquidityPool",
            "type": "publicKey"
          },
          {
            "name": "collectionInfo",
            "type": "publicKey"
          },
          {
            "name": "startedAt",
            "type": "u64"
          },
          {
            "name": "expiredAt",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "finishedAt",
            "type": "u64"
          },
          {
            "name": "originalPrice",
            "type": "u64"
          },
          {
            "name": "amountToGet",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "royaltyAmount",
            "type": "u64"
          },
          {
            "name": "rewardInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "feeInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "royaltyInterestRate",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "loanStatus",
            "type": {
              "defined": "LoanStatus"
            }
          },
          {
            "name": "loanType",
            "type": {
              "defined": "LoanType"
            }
          }
        ]
      }
    },
    {
      "name": "priceBasedLiquidityPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "baseBorrowRate",
            "type": "u32"
          },
          {
            "name": "variableSlope1",
            "type": "u32"
          },
          {
            "name": "variableSlope2",
            "type": "u32"
          },
          {
            "name": "utilizationRateOptimal",
            "type": "u32"
          },
          {
            "name": "reserveFactor",
            "type": "u32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "liquidityAmount",
            "type": "u64"
          },
          {
            "name": "liqOwner",
            "type": "publicKey"
          },
          {
            "name": "liqSeed",
            "type": "u8"
          },
          {
            "name": "amountOfStaked",
            "type": "u64"
          },
          {
            "name": "depositApr",
            "type": "u64"
          },
          {
            "name": "borrowApr",
            "type": "u64"
          },
          {
            "name": "borrowCumulative",
            "type": "u64"
          },
          {
            "name": "depositCumulative",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          },
          {
            "name": "borrowCommission",
            "type": "u32"
          },
          {
            "name": "depositCommission",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "liquidityPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "rewardInterestRateTime",
            "type": "u64"
          },
          {
            "name": "feeInterestRateTime",
            "type": "u64"
          },
          {
            "name": "rewardInterestRatePrice",
            "type": "u64"
          },
          {
            "name": "feeInterestRatePrice",
            "type": "u64"
          },
          {
            "name": "liquidityAmount",
            "type": "u64"
          },
          {
            "name": "liqOwner",
            "type": "publicKey"
          },
          {
            "name": "liqSeed",
            "type": "u8"
          },
          {
            "name": "amountOfStaked",
            "type": "u64"
          },
          {
            "name": "userRewardsAmount",
            "type": "u64"
          },
          {
            "name": "apr",
            "type": "u64"
          },
          {
            "name": "cumulative",
            "type": "u64"
          },
          {
            "name": "lastTime",
            "type": "u64"
          },
          {
            "name": "oldCumulative",
            "type": "u64"
          },
          {
            "name": "period",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CollectionInfoParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loanToValue",
            "type": "u64"
          },
          {
            "name": "collaterizationRate",
            "type": "u64"
          },
          {
            "name": "royaltyFeeTime",
            "type": "u64"
          },
          {
            "name": "royaltyFeePrice",
            "type": "u64"
          },
          {
            "name": "expirationTime",
            "type": "u64"
          },
          {
            "name": "isPriceBased",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PriceBasedLiqPoolInputParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "baseBorrowRate",
            "type": "u32"
          },
          {
            "name": "variableSlope1",
            "type": "u32"
          },
          {
            "name": "variableSlope2",
            "type": "u32"
          },
          {
            "name": "utilizationRateOptimal",
            "type": "u32"
          },
          {
            "name": "reserveFactor",
            "type": "u32"
          },
          {
            "name": "borrowCommission",
            "type": "u32"
          },
          {
            "name": "depositCommission",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "AuthorizationDataLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payload",
            "type": {
              "vec": {
                "defined": "TaggedPayload"
              }
            }
          }
        ]
      }
    },
    {
      "name": "TaggedPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payload",
            "type": {
              "defined": "PayloadTypeLocal"
            }
          }
        ]
      }
    },
    {
      "name": "SeedsVecLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seeds",
            "docs": [
              "The vector of derivation seeds."
            ],
            "type": {
              "vec": "bytes"
            }
          }
        ]
      }
    },
    {
      "name": "ProofInfoLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proof",
            "docs": [
              "The merkle proof."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "AvailableLoanTypes",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OnlyTimeBased"
          },
          {
            "name": "OnlyPriceBased"
          }
        ]
      }
    },
    {
      "name": "StakeType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "DeGods"
          },
          {
            "name": "GemWorksNewest"
          },
          {
            "name": "Cets"
          }
        ]
      }
    },
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unstaked"
          },
          {
            "name": "Staked"
          }
        ]
      }
    },
    {
      "name": "LotState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotActive"
          },
          {
            "name": "Active"
          },
          {
            "name": "Redeemed"
          },
          {
            "name": "PaidBackWithGrace"
          }
        ]
      }
    },
    {
      "name": "LoanStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Proposed"
          },
          {
            "name": "Rejected"
          },
          {
            "name": "Activated"
          },
          {
            "name": "PaidBack"
          },
          {
            "name": "Liquidated"
          },
          {
            "name": "PaidBackWithGrace"
          }
        ]
      }
    },
    {
      "name": "LoanType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TimeBased"
          },
          {
            "name": "PriceBased"
          }
        ]
      }
    },
    {
      "name": "PayloadTypeLocal",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pubkey",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "Seeds",
            "fields": [
              {
                "defined": "SeedsVecLocal"
              }
            ]
          },
          {
            "name": "MerkleProof",
            "fields": [
              {
                "defined": "ProofInfoLocal"
              }
            ]
          },
          {
            "name": "Number",
            "fields": [
              "u64"
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "LoanUpdate",
      "fields": [
        {
          "name": "loan",
          "type": "string",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "LoanStatus"
          },
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInstruction",
      "msg": "InvalidInstruction"
    },
    {
      "code": 6001,
      "name": "MoreThanHave",
      "msg": "MoreThanHave"
    },
    {
      "code": 6002,
      "name": "LoanIsNotProposed",
      "msg": "LoanIsNotProposed"
    },
    {
      "code": 6003,
      "name": "CollectionInfoDoNotConnectWithNftMint",
      "msg": "CollectionInfoDoNotConnectWithNftMint"
    },
    {
      "code": 6004,
      "name": "IncorrectNftMint",
      "msg": "IncorrectNftMint"
    },
    {
      "code": 6005,
      "name": "IncorrectTokenAccount",
      "msg": "IncorrectTokenAccount"
    },
    {
      "code": 6006,
      "name": "LoanIsNotActivated",
      "msg": "LoanIsNotActivated"
    },
    {
      "code": 6007,
      "name": "LoanIsNotLiquidated",
      "msg": "LoanIsNotLiquidated"
    },
    {
      "code": 6008,
      "name": "TimeIsExpired",
      "msg": "TimeIsExpired"
    },
    {
      "code": 6009,
      "name": "CollectionInfoDoesntMatchLiquidityPool",
      "msg": "CollectionInfoDoesntMatchLiquidityPool"
    },
    {
      "code": 6010,
      "name": "CannotClose",
      "msg": "CannotClose"
    },
    {
      "code": 6011,
      "name": "WrongTypeOfAvailableLoan",
      "msg": "WrongTypeOfAvailableLoan"
    },
    {
      "code": 6012,
      "name": "InvalidLoan",
      "msg": "InvalidLoan"
    },
    {
      "code": 6013,
      "name": "NftsAttemptsAreUsed",
      "msg": "NftsAttemptsAreUsed"
    },
    {
      "code": 6014,
      "name": "GracePeriodNotEnded",
      "msg": "GracePeriodNotEnded"
    },
    {
      "code": 6015,
      "name": "GracePerionIsAlreadyEnded",
      "msg": "GracePerionIsAlreadyEnded"
    },
    {
      "code": 6016,
      "name": "LotIsAlreadyEnded",
      "msg": "LotIsAlreadyEnded"
    },
    {
      "code": 6017,
      "name": "LotIsNotLiquidatedYet",
      "msg": "LotIsNotLiquidatedYet"
    },
    {
      "code": 6018,
      "name": "TicketIsRevealedOrRejected",
      "msg": "TicketIsRevealedOrRejected"
    },
    {
      "code": 6019,
      "name": "TicketIsNotWinning",
      "msg": "TicketIsNotWinning"
    },
    {
      "code": 6020,
      "name": "WrongLiqPool",
      "msg": "WrongLiqPool"
    },
    {
      "code": 6021,
      "name": "WrongLiqOwner",
      "msg": "WrongLiqOwner"
    },
    {
      "code": 6022,
      "name": "WrongUserOnLoan",
      "msg": "WrongUserOnLoan"
    },
    {
      "code": 6023,
      "name": "WrongAdmin",
      "msg": "WrongAdmin"
    },
    {
      "code": 6024,
      "name": "WrongNftMintOnLoan",
      "msg": "WrongNftMintOnLoan"
    },
    {
      "code": 6025,
      "name": "WrongLoanOnLiquidationLot",
      "msg": "WrongLoanOnLiquidationLot"
    },
    {
      "code": 6026,
      "name": "WrongNftMintOnLiquidationLot",
      "msg": "WrongNftMintOnLiquidationLot"
    },
    {
      "code": 6027,
      "name": "WrongNftMintOnNftAttempts",
      "msg": "WrongNftMintOnNftAttempts"
    },
    {
      "code": 6028,
      "name": "WrongLiqPoolOnDeposit",
      "msg": "WrongLiqPoolOnDeposit"
    },
    {
      "code": 6029,
      "name": "WrongUserOnDeposit",
      "msg": "WrongUserOnDeposit"
    },
    {
      "code": 6030,
      "name": "WrongTokenAccountOnLoan",
      "msg": "WrongTokenAccountOnLoan"
    },
    {
      "code": 6031,
      "name": "WrongLiquidator",
      "msg": "WrongLiquidator"
    },
    {
      "code": 6032,
      "name": "WrongRoyaltyAddressOnCollectionInfo",
      "msg": "WrongRoyaltyAddressOnCollectionInfo"
    },
    {
      "code": 6033,
      "name": "WrongLiqPoolOnCollectionInfo",
      "msg": "WrongLiqPoolOnCollectionInfo"
    },
    {
      "code": 6034,
      "name": "WrongCollectionInfoOnLoan",
      "msg": "WrongCollectionInfoOnLoan"
    },
    {
      "code": 6035,
      "name": "WrongLiqPoolOnLoan",
      "msg": "WrongLiqPoolOnLoan"
    },
    {
      "code": 6036,
      "name": "WrongVaultAccountOnLiquidationLot",
      "msg": "WrongVaultAccountOnLiquidationLot"
    },
    {
      "code": 6037,
      "name": "WrongLiqLotOnLotTicket",
      "msg": "WrongLiqLotOnLotTicket"
    },
    {
      "code": 6038,
      "name": "WrongUserOnLotTicket",
      "msg": "WrongUserOnLotTicket"
    },
    {
      "code": 6039,
      "name": "LotStateIsNotActive",
      "msg": "LotStateIsNotActive"
    },
    {
      "code": 6040,
      "name": "WrongLoanToValue",
      "msg": "WrongLoanToValue"
    },
    {
      "code": 6041,
      "name": "FunctionIsNotSupportedForNow",
      "msg": "Function is not supported right now"
    },
    {
      "code": 6042,
      "name": "CantSetLtvMoreThanNftValue",
      "msg": "Can't set loan to value more than 100%"
    },
    {
      "code": 6043,
      "name": "FraktNftStakeNotInitialized",
      "msg": "FraktNftStakeNotInitialized"
    },
    {
      "code": 6044,
      "name": "FraktNftNotStaked",
      "msg": "FraktNftNotStaked"
    },
    {
      "code": 6045,
      "name": "FraktNftStakeOwnerDoesntMatch",
      "msg": "FraktNftStakeOwnerDoesntMatch"
    },
    {
      "code": 6046,
      "name": "TokenAccountDoesntContainNft",
      "msg": "TokenAccountDoesntContainNft"
    },
    {
      "code": 6047,
      "name": "StakingAccountDoesntMatchAttemptsNftMint",
      "msg": "StakingAccountDoesntMatchAttemptsNftMint"
    },
    {
      "code": 6048,
      "name": "UserDoesntOwnStake",
      "msg": "UserDoesntOwnStake"
    },
    {
      "code": 6049,
      "name": "BadRuleSet",
      "msg": "BadRuleSetForProgrammableNft"
    },
    {
      "code": 6050,
      "name": "DelegateBuilderFailed",
      "msg": "DelegateBuilderFailed"
    },
    {
      "code": 6051,
      "name": "LockBuilderFailed",
      "msg": "LockBuilderFailed"
    },
    {
      "code": 6052,
      "name": "NoStandardOnNft",
      "msg": "NoStandardOnNft"
    },
    {
      "code": 6053,
      "name": "OldPerpetualsAreDisabled",
      "msg": "OldPerpetualsAreDisabled"
    }
  ]
};
