import base64
import binascii

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.exceptions import InvalidTag

from crypto import generate_key, encrypt_message, decrypt_message

app = FastAPI(title="AES-256-GCM Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class EncryptRequest(BaseModel):
    message: str


class DecryptRequest(BaseModel):
    ciphertext: str
    nonce: str
    tag: str
    key: str


@app.get("/api/health")
def health():
    return {"status": "running"}


@app.post("/api/encrypt")
def encrypt(request: EncryptRequest):
    if not request.message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    key = generate_key()
    result = encrypt_message(request.message, key)

    return {
        **result,
        "key": base64.b64encode(key).decode("utf-8")
    }


@app.post("/api/decrypt")
def decrypt(request: DecryptRequest):
    try:
        key = base64.b64decode(request.key, validate=True)

        result = decrypt_message(
            {
                "ciphertext": request.ciphertext,
                "nonce": request.nonce,
                "tag": request.tag
            },
            key
        )

        return {"message": result}

    except (InvalidTag, ValueError, binascii.Error):
        raise HTTPException(
            status_code=400,
            detail="Decryption failed: invalid key or encrypted data"
        )
