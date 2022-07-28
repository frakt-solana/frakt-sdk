# frakt-sdk
[![npm version](https://badge.fury.io/js/@frakt-protocol%2Ffrakt-sdk.svg)](https://badge.fury.io/js/@frakt-protocol%2Ffrakt-sdk)

Library to interact with frakt.xyz protocols on Solana.

## Install
```bash
npm install @frakt-protocol/frakt-sdk --save
```

## Usage
```typescript
import { utils, loans, pools } from '@frakt-protocol/frakt-sdk';
```
Also `frakt-sdk` exports [AnchorProvider](https://github.com/project-serum/anchor), [BN.js](https://github.com/indutny/bn.js), [@raydium-io/raydium-sdk](https://sdk.raydium.io/) and [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/).
```typescript
import { AnchorProvider, BN, web3 } from '@frakt-protocol/frakt-sdk';
```
### Current versions in dependencies
| Library                 | Version       |
|-------------------------|---------------|
| @project-serum/anchor   | 0.24.2        |
| @raydium-io/raydium-sdk | 1.0.1-beta.46 |
| @solana/web3.js         | ^1.36.0       |
| BN.js                   | ^5.1.2        |


## Examples
```typescript
import { utils, web3 } from '@frakt-protocol/frakt-sdk';

const { accountInfo } = await utils.getTokenAccount({
    tokenMint: new web3.PublicKey('...'),
    owner: new web3.PublicKey('...'),
    connection: new web3.Connection('ENDPOINT'),
});
```
```typescript
import { pools, web3, TokenInfo } from '@frakt-protocol/frakt-sdk';

const poolDataByMint = await pools.fetchPoolDataByMint({
    connection: web3.Connection('ENDPOINT'),
    tokensMap: new Map<string, TokenInfo>(),
});
```

## Docs
All methods and interfaces of `frakt-sdk` are available in [documentation](https://frakt-solana.github.io/frakt-sdk/).
