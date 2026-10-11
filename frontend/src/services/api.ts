import type {
  EncryptedMessage,
  DecryptedMessage
} from "../types/crypto";

const API_URL = "http://127.0.0.1:8000";

async function handleResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let message = "An unexpected error occurred";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      message = `HTTP error ${response.status}`;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function encryptMessage(
  message: string
): Promise<EncryptedMessage> {
  const response = await fetch(`${API_URL}/api/encrypt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  return handleResponse<EncryptedMessage>(response);
}

export async function decryptMessage(
  data: EncryptedMessage
): Promise<DecryptedMessage> {
  const response = await fetch(`${API_URL}/api/decrypt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return handleResponse<DecryptedMessage>(response);
}
