https://github.com/ethers-io/ethers.js


gm team - I'm doing some benchmarking to determine pricing accuracy for a few different providers for tokens our users are holding. We have quite a few users holding holding this token on Ethereum: 0x9ba021b0a9b958b5e75ce9f6dff97c7ee52cb3e6 which I don't see a price from Codex on.
Is there a way to report the price? The token doesn't have a pool, but has a contract function to get the ratio to the other token (which does have a pool). I've seen this implementation before so was curious to understand if you also account for it


For context; this is what the implementation looks like:
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL_HERE');
const contract = new ethers.Contract('0x9ba021b0a9b958b5e75ce9f6dff97c7ee52cb3e6', ['function convertToAssets(uint256) view returns (uint256)'], provider);

(async () => {
  const output = await contract.convertToAssets(ethers.parseUnits('1', 18));
  const ratio = Number(output) / 1e18;
  const assetPrice = (sharePrice: number) => sharePrice * ratio;
})();



import { ethers } from 'ethers';
