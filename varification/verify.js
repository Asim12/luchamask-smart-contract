// npx hardhat verify --constructor-args verify.js 0xD714d780CC6BcD64E8Cec160e4bDb32ac0129b68 --network bsc --show-stack-traces
require('dotenv').config();
const {name, symbol, TVK_CONTRACT, MAX_TOKENS, IPFS_HIDDEN, TOTAL_RESERVE, IPFS_BASE_PATH,PROVENANCE_HASH  } = process.env;

module.exports = [
    TVK_CONTRACT,
    MAX_TOKENS,
    TOTAL_RESERVE,
    `ipfs://${IPFS_HIDDEN}/`,
    `ipfs://${IPFS_BASE_PATH}/`,
    PROVENANCE_HASH,
    name, 
    symbol
];