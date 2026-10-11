export interface EncryptedMessage {
  ciphertext: string;
  nonce: string;
  tag: string;
  key: string;
}

export interface DecryptedMessage {
  message: string;
}
