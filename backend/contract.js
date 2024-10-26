import { JsonRpcProvider } from 'ethers/providers';
import { Contract } from 'ethers/contract';
import { Wallet } from 'ethers/wallet';

import contracts from '../frontend/src/contracts.json' assert { type: 'json' };

const adminAdress = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

export const MainContract = async () => {
    const blockchainURL = 'http://127.0.0.1:8545/';
    const provider = new JsonRpcProvider(blockchainURL);

    const signer = new Wallet(adminAdress, provider);
    const { address, abi } = contracts.contracts.Main
    const contract = new Contract(address, abi, provider)
    const contract_ = signer ? contract.connect(signer) : contract
    return contract_
};
