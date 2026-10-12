import type {
  EncryptedMessage,
  DecryptedMessage
} from "../types/crypto";

const API_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(
    message: string,
    code: string,
    status: number
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function handleResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    let code = "UNKNOWN_ERROR";

    try {
      const error = await response.json();
      const detail = error.detail;

      if (typeof detail === "string") {
        message = detail;
      } else if (detail && typeof detail === "object") {
        message = detail.message || message;
        code = detail.code || code;
      }
    } catch {
      // Preserve the HTTP error if the response is not JSON.
    }

    throw new ApiError(message, code, response.status);
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
