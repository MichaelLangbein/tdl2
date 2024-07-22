# Crypto

- https://security.stackexchange.com/questions/211/how-to-securely-hash-passwords
- https://stackoverflow.com/questions/549/the-definitive-guide-to-form-based-website-authentication
- https://pdos.csail.mit.edu/papers/webauth:sec10.pdf

## Hashing

Hash:

- input: string of arbitrary length, output: string of fixed length
- forward is easy, backward is very hard - verification is easy - output known as 'hash' or 'digest'

-

- `SHA256`: _secure hash algorithm_
  - by NSA
  - one-way. Cannot decrypt
- `MD5`: _message digest algorithm_
  - similar to SHA256, but only 128bit
  - faster to compute
  - **deprecated**!!
- `RSA`: _Rivest-Shamir-Adleman_
  - pk/sk pair
  - two-way
- `Argon2`

```js
import { createHash } from 'crypto';

function hash(input: string) {
  const digest = createHash('sha256').update(input).digest('hex');
  return digest;
}

const password = 'hi mom!';
const hash1 = hash(password);
console.log(hash1);
```

## Salting to prevent pre-computation attacks

- Hashing functions are deterministic
  - So they can be cracked with very big lookup tables which contain the hashes of the most common password hashes (called a _rainbow-table_)
- Solution: add salt
  - for every user, pick a random number
  - append it to the users password before hashing
    - this way, if a hacker obtains the hash **and the salt**, they still cannot use a rainbow-table, but instead must calculate each hash anew
      - i.e.: salts prevent _pre-computation attacks_
    - this way, if two users have the same password, they still won't have the same hash, because they have different salts
  - you can store the salt as plain text along with the hashed password (https://security.stackexchange.com/questions/17421/how-to-store-salt)

```js
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

function createUser(email: string, password: string) {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');
  const userData = { email, saltedHashedPassword: `${salt}:${hashedPassword}` };
  return userData;
}

function login(email: string, password: string) {
  const user = users.find((u) => u.email === email);

  if (!user) return 'forbidden';

  const [salt, truePasswordHashedHex] = user.saltedHashedPassword.split(':');
  const truePasswordHashed = Buffer.from(truePasswordHashedHex, 'hex');
  const givenPasswordHashed = scryptSync(password, salt, 64);
  const match = timingSafeEqual(truePasswordHashed, givenPasswordHashed); // prevents timing attacks

  if (!match) return 'forbidden';
  else return 'login success!';
}
```

### Timing attacks

Attackers measure time that password verification takes to get information about how long it is.

### Work factor

## HMAC: hash-based message authentication code

- A hash that also requires a password.
- Example: JSON Web-token

```js
import {createHmac} = require("crypto");

const key = "super-secret";
const message = "hi mom!";
const hmac = createHmac("sha256", key).update(message).digest("hex");

```

## Symmetric encryption

- Encryption is different from hashing:
  - must be quickly reversible
  - is randomized, not

```js
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

// cipher: the encrypted message
// iv: initial vector (like a salt?)

const message = 'i like turtles';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);
```

## Public key crypto

### En- and decryption

encrypted = encrypt(message, pubKey)
message = decrypt(encrypted, secKey)

### Verification

message = "hi mom"
signed = encrypt(message, secKey)
output = decrypt(signed, pubKey)
return output === message

# Blockchain

## Proof of work vs proof of stake

Against double spending.
Proof of work, most popularly implemented in Bitcoin (BTC), etherium.
Proof of stake, most popularly implemented in Cardano (ADA).

Proof of stake:

1. One node is randomly chosen to validate the next block.
   1. The more coins you deposit into the network as stake, the more likely you'll be chosen.
2. After validation, the validator receives the fees associated with the transactions.
3. If validators approve fraudulent blocks, they lose their stake.
4. Stake will be released after some time. (Long time to allow for 2nd validation)

Proof of stake: - 51% attack possible, but costs 79 billion USD
Proof of work: - 51% hashing power - possible by uniting the 3 biggest current miner-groups

## Implementation

```ts
import * as crypto from 'crypto';

class Transaction {
    constructor(
        public amount: number,
        public payer: string, // public key
        public receiver: string // public key
    ) {}
}

class Block {

    public nonce = Math.round(Math.random() * 999999999);
    public solution: number;

    constructor(
        public previousHash: string,
        public transaction: Transaction,
        public ts = Date.now()
    ) {}

    get hash() {
        const str = JSON.stringify(this);
        const hashFunction = crypto.createHash('SHA256');
        hashFunction.update(str).end();
        return hashFunction.digest('hex');
    }

    setSolution(solution: number) {
        this.solution = solution;
    }

    verifySolution(): boolean {
        const hash = crypto.createHash('MD5');
        hash.update((this.nonce + this.solution)).toString().end();
        const attempt = hash.digest('hex');
        return attempt.substr(0, 4) === '0000';
    }
}

class Chain {
    public static instance new Chain();
    chain: Block[];

    constructor() {
        const genesisBlock = new Block(null, new Transaction(100, 'genesis', 'satoshi'));
        this.chain = [genesisBlock];
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    mine(nonce: number) {
        let solution = 1;
        console.log('mining ...');

        const hash = crypto.createHash('MD5');
        while(true) {
            hash.update((nonce + solution)).toString().end();
            const attempt = hash.digest('hex');
            if (attempt.substr(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return solution;
            }
            solution += 1;
        }
    }

    addBlock(transaction: Transaction, senderPublicKey: string, signature: string) {
        const verifyer = crypto.createVerify('SHA256');
        verifyer.update(JSON.encode(transaction));

        if (verifyer.verify(senderPublicKey, signature)) {
            const newBlock = new Block(this.getLastBlock().hash, transaction);
            const solution = this.mine(newBlock.nonce);  // solution can now be verified by anyone quickly.
            newBlock.setSolution(solution);
            this.chain.push(newBlock);
        }
    }
}

class Wallet {
    public publicKey: string;
    public privateKey: string;

    constructor() {
        const keyPair = crypto.generateKeyPairSync('rsa');
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
    }

    sendMoney(amount: number, receiverPublicKey: string) {
        const transaction = new Transaction(amount, this.publicKey, receiverPublicKey);

        const hashFunction = crypto.createSign('SHA256');
        hashFunction.update(JSON.encode(transaction)).end();
        const signature = hashFunction.sign(this.privateKey);

        Chain.instance.addBlock(transaction, this.publicKey, signature);
    }

}


const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();
satoshi.sendMoney(50, bob.publicKey);
bob.sendMoney(23, alice.publicKey);
alice.sendMoney(5, bob.publicKey);
```

## Torrents
