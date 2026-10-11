from crypto import generate_key, encrypt_message, decrypt_message

print("\n===== AES-256-GCM ENCRYPTION SYSTEM =====")

message = input("\nEnter a message to encrypt: ")

key = generate_key()

encrypted = encrypt_message(message, key)

print("\n----- ENCRYPTION RESULTS -----")

print("\nOriginal Message:")
print(message)

print("\nEncrypted Ciphertext:")
print(encrypted["ciphertext"])

print("\nNonce:")
print(encrypted["nonce"])

print("\nAuthentication Tag:")
print(encrypted["tag"])

print("\n----- DECRYPTION -----")

decrypted = decrypt_message(encrypted, key)

print("\nDecrypted Message:")
print(decrypted)

print("\nSUCCESS: AES-256-GCM encryption and decryption completed!")
