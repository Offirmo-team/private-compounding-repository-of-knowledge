import * as bip39 from '@scure/bip39';
//import { wordlist } from '@scure/bip39/wordlists/english.js';
import { wordlist } from '@scure/bip39/wordlists/french.js';

console.log(`\n\nXXX `)
// Generate x random words. Uses Cryptographically-Secure Random Number Generator.
const mn = bip39.generateMnemonic(wordlist);
console.log(mn);

// Reversible: Converts mnemonic string to raw entropy in form of byte array.
const ent = bip39.mnemonicToEntropy(mn, wordlist);

// Reversible: Converts raw entropy in form of byte array to mnemonic string.
bip39.entropyToMnemonic(ent, wordlist);

// Validates mnemonic for being 12-24 words contained in `wordlist`.
bip39.validateMnemonic(mn, wordlist);

// Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
//const seed1 = await bip39.mnemonicToSeed(mn, 'password');
//const seed2 = bip39.mnemonicToSeedSync(mn, 'password');
const seed = await bip39.mnemonicToSeedWebcrypto(mn, 'password'); // Native, WebCrypto version.

console.log(`XXX`, seed)
