import { createPublicClient, http, formatEther } from 'viem'
import { mainnet } from 'viem/chains'

// should be a private key
const keyⵧprivate_raw = '0xd2135CfB216b74109775236E36d4b433F1DF507B'

// derive the public key
const keyⵧpublic = '0xd2135CfB216b74109775236E36d4b433F1DF507B'

// ensure it's a valid address with funds
const client = createPublicClient({
	chain: mainnet,
	transport: http(),
})

//console.log({blockNumber: await client.getBlockNumber()})

// The below will send a single Batch JSON-RPC HTTP request to the RPC Provider.
const [ balance‿eth, ens_name ] = await Promise.all([
	client.getBalance({ address: keyⵧpublic }).then(formatEther),
	client.getEnsName({ address: keyⵧpublic}),
])

console.log({ balance‿eth, ens_name })
