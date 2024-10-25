import { ethers } from "ethers";
import contracts from '../frontend/src/contracts.json' assert { type: 'json' };

const adminAdress = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

export const MainContract = async () => {
    const blockchainURL = 'http://localhost:8545';

    const provider = new ethers.providers.JsonRpcProvider(blockchainURL);

    const signer = new ethers.Wallet(adminAdress, provider);
    const { address, abi } = contracts.contracts.Main
    const contract = new ethers.Contract(address, abi, provider)
    const deployed = await contract.deployed()
    if (!deployed) console.log("Le contrat n'est plus déployé")
    const contract_ = signer ? contract.connect(signer) : contract
    return contract_
};
