// src/security/key-cache.ts
//import { fakePrivateKey, fakePublicKey } from 'domains/keys/fake-key';
//import { AppDataSource } from '../config/ormconfig';
import { JwtKey } from '../domains/keys/key-entity';

let privateKeyCache: { kid: string; key: string } | null = null;
let publicKeyCache: Record<string, string> = {};

const fakePrivateKey =
`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBzoTLDvvzspJr
FymzZoRvmzDA2EDIVf35BGQeXlm11UpFOCyf9FQs0IK+lwg+mwwwHkuId4TxYyc8
5wps2tuZROTZDwOGP/yhdzPwyJSxTkt8b0e4EaG3ZaDSgNbfmo2nRMBO4l3WPNVh
+dyjC3tuYi3pKbv7nfOy6yKMRqWwadyXrXWn5PmCDawrfo+oPHi7D66y7db6QLue
+S6CMHk/KxypXfP8I8Qa9IKBBJb7dqL3tTKmlkBrXxU3ax/2zLWOTOtCUWPrYEqH
QtfsrS5cRpeipBBDP2bxeHZEsZbIH/6bjH+izgw4FW6vWzw9O09KtdKFyr3zsSte
kvtZWSNTAgMBAAECggEABK1EpBfM+bEF+oKZFYS0TnMqxoSRb6QvmEpEVj1Foe8v
NyNnZEbDnz864HmJj+Uy8phQj07/DMotQLl8lWrkoLq6YQiNN7ikkorrXHSirfKr
PKn8y5LVWbUgn+PPC59Rqscsctrgk9Js/cvHSMH2rQ++duF0cVp67obhEwyDZBHn
HaMGd58NrVYpSt+b6IJvx0Nfdo7KNo1EqPliqR7BWiITkanqAKOzwJ7AOENmW8b5
yyh3NB2vdoLf4QK88/t4y5Vny4jZ2uck2bD9fJ5Yl7RlYHht8mZwgm5+Ov3Zh0G+
lOBQ7HDOrpUqRdj37yWtt50BPurTwwTOX7AF4CQ10QKBgQD1IDc6bt/NP3XHMJjD
8znXMV34IHkdNCYfo+n5WUK3AEQDTYHqGXPYesTPqvC0qkLtzIlZMsP0gkkQ91io
zlIsQmxwJbabMIMg0UcDXZAL3rO1po1bUOsGmyY2TO2ble1VIrDeYzLWWj5Ewu46
0Q8hMY0LcSSgGF2OdBL91M6kAwKBgQDKZ36hvqRTSfwSddrnnFmXJU8temCHYF7i
hHsnexebaiJPtXVN3OhZpXJVrURDksltcBYuV0TjjWl6rY8xhIPMi4p3PIz2QXXZ
C2WVp4Cmz/fgoWQYSE1EwkoMk3kcxGeexN+MFSiV387FE1EeN4vJh1ugz4SUiJll
o0sMTWjqcQKBgQDCaVykIY+q76vv4WEn+F5liCfpRYgJW3TpH03Qj7TUA4ftvqlN
DAbPKP+zXPYvs+IFTHWaoyK7aCGfLS3KJGkT5VKv15lumBlIC/NwfeJjJ6wMZB40
0Ia25JJ3+qdxAIYNQchZeP+29jfwvVHIoEqJnw0oiAHuX6TD+NefLgr+FQKBgGq5
ydcFzGYyo90kEeqA0ejV/nsPhWi80yuECeBWkqsber4nA5SsAESM7c3pkA5FjzrK
mJeU4rlOLqlGbTQCGPE5PykCX53WBIsO7GDOMxNCpATpdPss3Ll97UfWV01o7u6U
BwA5g+4LVl8qgWJ6jZYVbqZL5i/gG2qxgPgatVCxAoGAc7U07tXZz3/IjZhRh48R
mQOL3hh4OokgTkbFjkN1Rcsr9NvaqXN1JHKZlKsLTGEHt5fNaS787RR4+zGl3uuz
Ft34vKa+6WUit4ZENJTZfZ/V4jKlywYddi4Rcn2XrP/DbJuJDvQ5/W84BR3KgjUC
Vf0jpfUt5uzh/qtb6rCjcQo=
-----END PRIVATE KEY-----
`

const fakePublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwc6Eyw7787KSaxcps2aE
b5swwNhAyFX9+QRkHl5ZtdVKRTgsn/RULNCCvpcIPpsMMB5LiHeE8WMnPOcKbNrb
mUTk2Q8Dhj/8oXcz8MiUsU5LfG9HuBGht2Wg0oDW35qNp0TATuJd1jzVYfncowt7
bmIt6Sm7+53zsusijEalsGncl611p+T5gg2sK36PqDx4uw+usu3W+kC7nvkugjB5
PyscqV3z/CPEGvSCgQSW+3ai97UyppZAa18VN2sf9sy1jkzrQlFj62BKh0LX7K0u
XEaXoqQQQz9m8Xh2RLGWyB/+m4x/os4MOBVur1s8PTtPSrXShcq987ErXpL7WVkj
UwIDAQAB
-----END PUBLIC KEY-----
`


export async function loadKeysIntoCache() {
  // const repo = AppDataSource.getRepository(JwtKey);
  // const keys = await repo.find();

  const keys: JwtKey[] = [
    {
      kid: 'fake-kid-1',
      publicKey: fakePublicKey,
      privateKey: fakePrivateKey,
      isActive: true,
      id: 1,
      createdAt: new Date(),
    }
  ];

  publicKeyCache = {};
  privateKeyCache = null;

  for (const k of keys) {
    publicKeyCache[k.kid] = k.publicKey;
    if (k.isActive && k.privateKey) {
      privateKeyCache = { kid: k.kid, key: k.privateKey };
    }
  }

  if (!privateKeyCache) {
    throw new Error('No active private key found');
  }
}

export function getPrivateKey() {
  if (!privateKeyCache) throw new Error('Private key not loaded');
  return privateKeyCache;
}

export function getPublicKey(kid: string) {
  return publicKeyCache[kid];
}

export function getAllPublicKeys() {
  return publicKeyCache;
}
