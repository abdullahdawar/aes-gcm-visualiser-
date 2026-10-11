import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Hash,
  Copy,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import type { EncryptedMessage } from "../types/crypto";

interface SecurityDetailsProps {
  encryptedData: EncryptedMessage | null;
}

export default function SecurityDetails({
  encryptedData
}: SecurityDetailsProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    if (!encryptedData) return;

    try {
      await navigator.clipboard.writeText(encryptedData.key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      alert("Unable to copy the key. Please copy it manually.");
    }
  }

  return (
    <section className="panel security-details">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldCheck size={20} />
          <h2>Security Details</h2>
        </div>
        <span className="status-badge">AES-256-GCM</span>
      </div>

      <p className="panel-description">
        Examine the cryptographic components used to protect
        your message.
      </p>

      <div className="security-grid">
        <div className="security-item">
          <KeyRound size={22} />
          <h3>256-bit Key</h3>
          <p>32-byte randomly generated secret key</p>
        </div>

        <div className="security-item">
          <Fingerprint size={22} />
          <h3>96-bit Nonce</h3>
          <p>12-byte random value used for encryption</p>
        </div>

        <div className="security-item">
          <Hash size={22} />
          <h3>128-bit Tag</h3>
          <p>16-byte authentication tag</p>
        </div>
      </div>

      {encryptedData ? (
        <div className="key-section">
          <div className="key-header">
            <div>
              <h3>Encryption Key</h3>
              <p>
                Required to decrypt this message.
                Keep this key confidential.
              </p>
            </div>
          </div>

          <div className="key-display">
            <code>
              {showKey
                ? encryptedData.key
                : "••••••••••••••••••••••••••••••••"}
            </code>
          </div>

          <div className="key-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={17} /> : <Eye size={17} />}
              {showKey ? "Hide Key" : "Reveal Key"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={copyKey}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied!" : "Copy Key"}
            </button>
          </div>

          <div className="security-notice">
            <ShieldCheck size={18} />
            <p>
              Educational demonstration only. In a real secure
              messaging system, encryption keys must be exchanged
              securely and must never be exposed to unauthorized users.
            </p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <KeyRound size={32} />
          <p>
            Encrypt a message to generate and inspect its security details.
          </p>
        </div>
      )}
    </section>
  );
}
