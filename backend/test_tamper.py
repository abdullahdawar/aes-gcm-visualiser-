import base64
from cryptography.exceptions import InvalidTag
from crypto import generate_key, encrypt_message, decrypt_message

print("\n===== AES-GCM TAMPER DETECTION TEST =====")

message = "This is a confidential message."

key = generate_key()
encrypted = encrypt_message(message, key)

print("\nOriginal message:", message)
print("Encrypted ciphertext:", encrypted["ciphertext"])

# Decode the ciphertext
ciphertext = bytearray(base64.b64decode(encrypted["ciphertext"]))

# Deliberately change one bit
ciphertext[0] ^= 1

# Encode the modified ciphertext
encrypted["ciphertext"] = base64.b64encode(ciphertext).decode()

print("\nTampered ciphertext:", encrypted["ciphertext"])

print("\nAttempting decryption...")

try:
    decrypted = decrypt_message(encrypted, key)
    print("Decrypted message:", decrypted)
except InvalidTag:
    print("\nSECURITY ALERT!")
    print("Authentication failed.")
    print("The encrypted message has been modified.")
    print("Decryption rejected successfully.")
