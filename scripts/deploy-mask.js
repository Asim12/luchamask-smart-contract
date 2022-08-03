
require('dotenv').config();
const {name, symbol, TVK_CONTRACT, MAX_TOKENS, IPFS_HIDDEN, TOTAL_RESERVE, IPFS_BASE_PATH,PROVENANCE_HASH } = process.env;

async function main() {
    const Contract = await ethers.getContractFactory("LuchaMaskRandom")

    const contractInstance = await Contract.deploy(
        TVK_CONTRACT,
        MAX_TOKENS,
        TOTAL_RESERVE,
        `ipfs://${IPFS_HIDDEN}/`,
        `ipfs://${IPFS_BASE_PATH}/`,
        PROVENANCE_HASH,
        name,
        symbol
    )
    console.log(`Contract deployed to "https://mumbai.polygonscan.com/address/${contractInstance.address}". Make sure to update "MASK_CONTRACT" env.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })