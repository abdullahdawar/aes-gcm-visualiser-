import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_key():
    return AESGCM.generate_key(bit_length=256)

def encrypt_message(message, key):
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)

    plaintext = message.encode("utf-8")
    encrypted = aesgcm.encrypt(nonce, plaintext, None)

    ciphertext = encrypted[:-16]
    tag = encrypted[-16:]

    return {
        "ciphertext": base64.b64encode(ciphertext).decode(),
        "nonce": base64.b64encode(nonce).decode(),
        "tag": base64.b64encode(tag).decode()
    }

def decrypt_message(data, key):
    aesgcm = AESGCM(key)

    nonce = base64.b64decode(data["nonce"], validate=True)
    ciphertext = base64.b64decode(data["ciphertext"], validate=True)
    tag = base64.b64decode(data["tag"], validate=True)

    plaintext = aesgcm.decrypt(
        nonce,
        ciphertext + tag,
        None
    )

    return plaintext.decode("utf-8")
