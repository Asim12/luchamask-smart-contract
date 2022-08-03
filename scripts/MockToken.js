
require('dotenv').config();
async function main() {
    const Contract = await ethers.getContractFactory("MockToken")
    const contractInstance = await Contract.deploy(
        "Testing",
        "TST"
    )
    console.log(`Contract deployed to "https://mumbai.polygonscan.com/address/${contractInstance.address}". Make sure to update "CUSTOM_CONTRACT" env.`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })