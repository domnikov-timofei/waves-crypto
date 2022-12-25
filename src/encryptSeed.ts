import { deriveSeedEncryptionKey } from './deriveSeedEncryptionKey';
import { stringToBytes } from './utf8';

export async function encryptSeed(
  input: Uint8Array,
  password: Uint8Array,
  hashRounds = 5000
) {
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const [key, iv] = await deriveSeedEncryptionKey(password, hashRounds, salt);

  const importedKey = await crypto.subtle.importKey(
    'raw',
    key,
    'AES-CBC',
    false,
    ['encrypt']
  );

  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv, length: iv.length },
      importedKey,
      input
    )
  );

  return Uint8Array.of(...stringToBytes('Salted__'), ...salt, ...encrypted);
}