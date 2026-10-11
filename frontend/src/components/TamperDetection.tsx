import { useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { decryptMessage } from "../services/api";
import type { EncryptedMessage } from "../types/crypto";

interface Props {
  encryptedData: EncryptedMessage | null;
}

export default function TamperDetection({ encryptedData }: Props) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function testTampering() {
    if (!encryptedData) return;

    setLoading(true);
    setResult("");

    try {
      const bytes = Uint8Array.from(
        atob(encryptedData.ciphertext),
        char => char.charCodeAt(0)
      );

      if (bytes.length === 0) {
        setResult("No ciphertext available to modify.");
        return;
      }

      bytes[0] ^= 1;

      const modifiedCiphertext = btoa(
        Array.from(bytes, byte => String.fromCharCode(byte)).join("")
      );

      await decryptMessage({
        ...encryptedData,
        ciphertext: modifiedCiphertext
      });

      setResult("Unexpected result: modified ciphertext was accepted.");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Decryption failed")
      ) {
        setResult("SUCCESS: Tampering detected. Authentication rejected.");
      } else {
        setResult(
          "Test could not complete. Check the backend connection."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel tamper-panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldAlert size={20} />
          <h2>Tamper Detection</h2>
        </div>
        <span className="status-badge">Integrity Test</span>
      </div>

      <p className="panel-description">
        Simulate an attacker modifying one bit of the ciphertext.
        AES-GCM should reject the modified message because its
        authentication tag will no longer match.
      </p>

      <button
        className="primary-button"
        onClick={testTampering}
        disabled={!encryptedData || loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="spin" />
            Testing...
          </>
        ) : (
          <>
            <ShieldAlert size={18} />
            Simulate Tampering
          </>
        )}
      </button>

      {result && (
        <div
          className={
            result.startsWith("SUCCESS")
              ? "success-message"
              : "error-message"
          }
          role="status"
        >
          {result.startsWith("SUCCESS") ? (
            <ShieldCheck size={20} />
          ) : (
            <ShieldAlert size={20} />
          )}
          <span>{result}</span>
        </div>
      )}
    </section>
  );
}
