const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Authentication
const apiKey = '4b5f885c-b764-4160-95f4-00ceb5124abb' //Example API Key
const integratorId = 'test-api'; // Example ID*

// Provider and Wallet Set Up
const provider = new ethers.providers.JsonRpcProvider('https://shibrpc.com/');
const privateKey = process.env.PRIVATEKEY
const wallet = new ethers.Wallet(privateKey, provider)
const signer = wallet.connect(provider)

// Swap Parameters
const sellToken = '0xc76f4c819d820369fb2d7c1531ab3bb18e6fe8d8'; // WBONE
const buyToken = '0xabbaf2746c46f8f269e0a252285abe9d8d8cdf63'; // MSWAPF
const sellAmount = '10000000000000000000'; // 10 WBONE
const buyTokenOrSellTokenHasFees = true; // MSWAPF has token taxes so this is set to true
const slippagePercentage = 0.05; // 5%

const getSwapQuote = async (
    sellToken,
    buyToken,
    sellAmount,
    buyTokenOrSellTokenHasFees,
    slippagePercentage,
    gasPrice,
    takerAddress
) => {
    try {
        const result = await axios.get(`https://shib.api-marswap.exchange/swap/v1/quote`, {
            params: {
                sellToken,
                buyToken,
                sellAmount,
                buyTokenOrSellTokenHasFees,
                slippagePercentage,
                gasPrice,
                takerAddress,
                integratorId
            },
            headers: {
                'marswap-api-key': apiKey
            }
        });
        return result.data;
    } catch (error) {
        console.error('Error fetching swap quote:', error);
        throw error;
    }
}

const approveToken = async (token, spenderAddress, amount) => {
    try {        
        const tokenContract = new ethers.Contract(token, ['function approve(address spender, uint256 amount)'], signer);
        const tx = await tokenContract.approve(spenderAddress, amount);
        const receipt = await tx.wait();
        if (receipt.status !== 1) {
            throw new Error('Approval transaction failed');
        }
        console.log(`Approved ${amount} tokens for ${spenderAddress}`);
    } catch (error) {
        console.error('Error approving tokens:', error);
        throw error;
    }
}

const main = async () => {
    
    try {
        const gasPrice = await provider.getGasPrice()        

        console.log('Getting quote...');

        const quote = await getSwapQuote(
            sellToken,
            buyToken,
            sellAmount,
            buyTokenOrSellTokenHasFees,
            slippagePercentage,
            gasPrice,
            wallet.address
        );

        console.log(quote)

        await approveToken(sellToken, quote.allowanceTarget, quote.sellAmount);

        const transaction = {
            from: quote.from,
            to: quote.to,
            gasLimit: ethers.BigNumber.from(quote.gas),
            gasPrice: ethers.BigNumber.from(quote.gasPrice),
            value: ethers.BigNumber.from(quote.value),
            data: quote.data
        };

        console.log('Sending transaction...');

        const txn = await signer.sendTransaction(transaction);

        console.log('Swapping tokens...');

        const txnReceipt = await txn.wait()

        if (txnReceipt && txnReceipt.blockNumber && txnReceipt.status === 1) {
            console.log(`Transaction https://shibariumscan.io/tx/${txnReceipt.transactionHash} mined, status success`);
        } else {
            console.log(`Transaction https://shibariumscan.io/tx/${txnReceipt.transactionHash} status failed`);
        }

    } catch (error) {
        console.error('Error swapping tokens:', error);
    }
}

main()