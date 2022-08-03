
require('dotenv').config();
const { TVK_CONTRACT, MASK_CONTRACT  } = process.env;
async function main() {
    const Contract = await ethers.getContractFactory("MiddleContract")
    const contractInstance = await Contract.deploy(MASK_CONTRACT, TVK_CONTRACT)
    console.log(`Contract deployed to "https://mumbai.polygonscan.com/address/${contractInstance.address}". Make sure to update "MIDDLE_CONTRACT" env.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })