
require('dotenv').config();
const { START_FROM, MAX_TOKENS } = process.env;

async function main() {
    const Contract = await ethers.getContractFactory("RandomlyAssigned")
    const contractInstance = await Contract.deploy(
        MAX_TOKENS,
        START_FROM
    )
    console.log(`Contract deployed to "https://mumbai.polygonscan.com/address/${contractInstance.address}". Make sure to update "CUSTOM_CONTRACT" env.`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })