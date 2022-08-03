// call it like "npm run interact -- 1"

const Web3 = require('web3');

require('dotenv').config();

const { argv } = require('process');

const API_URL = process.env.MN_API_URL;
const PUBLIC_KEY = process.env.MN_PUBLIC_KEY_OWNER;
const PRIVATE_KEY = process.env.MN_PRIVATE_KEY_OWNER;

const IPFS_BASE_PATH = process.env.IPFS_BASE_PATH;

const web3 = new Web3(API_URL);

const contract = require("../artifacts/contracts/LuchaMask.sol/LuchaMask.json");
const contractAddress = process.env.MASK_CONTRACT;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function transaction(method, params= [], value= null){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest');

    let tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods[method](...params).encodeABI(),
    };

    if (value)
        tx.value= value // web3.utils.toHex(web3.utils.toWei('50', 'gwei'))

    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`LOG (${method}): `, JSON.stringify(transactionReceipt, null, 2))
}

(async () => {
    const command= argv[2];

    if(command === "1") {
        console.log (`Setting base url.`)
        await transaction("setBaseURI", [`ipfs://${IPFS_BASE_PATH}/`]);
        console.log("baseURI: ", await nftContract.methods.baseURI().call());
    } else if(command === "2") {
        console.log (`Minting first mask`)
        await transaction("mintMask", [], 5000000000000000);
        console.log("Token counter: ", await nftContract.methods.totalSupply().call());
    } else if(command === "3") {
        console.log (`Setting random offset`)
        await transaction("setStartingIndex", []);
        console.log("Offset: ", await nftContract.methods.totalSupply().call());
    } else if(command === "4") {
        console.log (`Getting token id`)
        console.log("Offset: ", await nftContract.methods.tokenURI(0).call());
    } else {
        console.error ("Unknown command!");
    }
})();
