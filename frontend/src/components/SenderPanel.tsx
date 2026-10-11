import { useState } from "react";
import { Lock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { encryptMessage } from "../services/api";
import type { EncryptedMessage } from "../types/crypto";

interface SenderPanelProps {
  onEncrypted: (data: EncryptedMessage) => void;
}

export default function SenderPanel({
  onEncrypted
}: SenderPanelProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleEncrypt() {
    if (!message.trim()) {
      setError("Please enter a message first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await encryptMessage(message);
      onEncrypted(result);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Encryption failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel sender-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Send size={20} />
          <h2>Sender</h2>
        </div>
        <span className="status-badge">AES-256-GCM</span>
      </div>

      <p className="panel-description">
        Enter a message to encrypt using AES-256-GCM.
      </p>

      <label htmlFor="message-input" className="input-label">
        Plaintext Message
      </label>

      <textarea
        id="message-input"
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setSuccess(false);
        }}
        placeholder="Type your confidential message here..."
        rows={6}
        maxLength={5000}
      />

      <div className="input-footer">
        <span>{message.length} / 5000 characters</span>
      </div>

      <button
        className="primary-button"
        onClick={handleEncrypt}
        disabled={loading || !message.trim()}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="spin" />
            Encrypting...
          </>
        ) : (
          <>
            <Lock size={18} />
            Encrypt Message
          </>
        )}
      </button>

      {success && (
        <div className="success-message" role="status">
          <CheckCircle2 size={18} />
          Message encrypted successfully.
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
