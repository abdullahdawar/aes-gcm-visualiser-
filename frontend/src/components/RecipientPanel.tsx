import { useEffect, useState } from "react";
import {
  LockKeyhole,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { decryptMessage } from "../services/api";
import type { EncryptedMessage } from "../types/crypto";

interface RecipientPanelProps {
  encryptedData: EncryptedMessage | null;
}

export default function RecipientPanel({
  encryptedData
}: RecipientPanelProps) {
  const [key, setKey] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setKey("");
    setDecryptedMessage("");
    setError("");
    setShowKey(false);
  }, [encryptedData]);

  async function handleDecrypt() {
    if (!encryptedData || !key.trim()) {
      setError("Please enter the recipient's secret key.");
      return;
    }

    setLoading(true);
    setError("");
    setDecryptedMessage("");

    try {
      const result = await decryptMessage({
        ...encryptedData,
        key: key.trim()
      });

      setDecryptedMessage(result.message);
    } catch {
      setError(
        "Authentication failed. The key may be incorrect or the encrypted data may have been modified."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel recipient-panel">
      <div className="panel-header">
        <div className="panel-title">
          <LockKeyhole size={20} />
          <h2>Recipient</h2>
        </div>
        <span className="status-badge">Protected</span>
      </div>

      <p className="panel-description">
        Receive the encrypted message and enter the correct
        secret key to decrypt it.
      </p>

      {!encryptedData ? (
        <div className="empty-state">
          <LockKeyhole size={36} />
          <p>Waiting for an encrypted message...</p>
        </div>
      ) : (
        <>
          <label className="input-label">
            Received Ciphertext
          </label>

          <div className="ciphertext-box">
            {encryptedData.ciphertext}
          </div>

          <label
            htmlFor="recipient-key"
            className="input-label"
          >
            Secret Decryption Key
          </label>

          <div className="key-input-wrapper">
            <input
              id="recipient-key"
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(event) => {
                setKey(event.target.value);
                setDecryptedMessage("");
                setError("");
              }}
              placeholder="Enter the Base64 secret key"
              autoComplete="off"
              spellCheck={false}
            />

            <button
              type="button"
              className="icon-button"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            className="primary-button"
            onClick={handleDecrypt}
            disabled={loading || !key.trim()}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Decrypting...
              </>
            ) : (
              <>
                <Unlock size={18} />
                Decrypt Message
              </>
            )}
          </button>

          {decryptedMessage && (
            <div className="decryption-success" role="status">
              <div className="result-heading">
                <ShieldCheck size={20} />
                Authentication Successful
              </div>

              <p className="result-label">
                Decrypted Plaintext
              </p>

              <div className="plaintext-result">
                {decryptedMessage}
              </div>
            </div>
          )}

          {error && (
            <div className="decryption-error" role="alert">
              <ShieldAlert size={20} />
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
