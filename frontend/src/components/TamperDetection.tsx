import { useState } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { ApiError, decryptMessage } from "../services/api";
import CiphertextComparison from "./CiphertextComparison";
import type { EncryptedMessage } from "../types/crypto";

interface Props {
  encryptedData: EncryptedMessage | null;
}

export default function TamperDetection({ encryptedData }: Props) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [modifiedCiphertext, setModifiedCiphertext] = useState("");

  async function testTampering() {
    if (!encryptedData) return;

    setLoading(true);
    setActiveStep(1);
    setResult("");
    setModifiedCiphertext("");

    try {
      const bytes = Uint8Array.from(
        atob(encryptedData.ciphertext),
        char => char.charCodeAt(0)
      );

      if (bytes.length === 0) {
        setResult("No ciphertext available to modify.");
        return;
      }

      // Flip the least significant bit of the first byte.
      bytes[0] ^= 1;

      const modified = btoa(
        Array.from(bytes, byte =>
          String.fromCharCode(byte)
        ).join("")
      );

      setModifiedCiphertext(modified);
      setActiveStep(2);

      // Send genuinely modified ciphertext to the backend.
      setActiveStep(3);
      await decryptMessage({
        ...encryptedData,
        ciphertext: modified
      });

      setResult(
        "WARNING: Modified ciphertext was accepted."
      );
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "AUTHENTICATION_FAILED"
      ) {
        setResult(
          "SUCCESS: Authentication failed as expected. " +
          "The modified ciphertext was rejected."
        );
      } else {
        setResult(
          "Test could not complete. Check the backend connection."
        );
      }
    } finally {
      setActiveStep(4);
      setLoading(false);
    }
  }

  function resetTest() {
    setActiveStep(0);
    setResult("");
    setModifiedCiphertext("");
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
        Discover how AES-256-GCM detects unauthorized changes.
        This test modifies one bit of the ciphertext and
        checks whether the backend rejects the message.
      </p>

      <div className="tamper-steps">
        <div className={`tamper-step ${activeStep >= 1 ? "completed" : ""}`}>
          <span className="step-number">01</span>
          <span>Original ciphertext generated</span>
        </div>

        <div className={`tamper-step ${activeStep >= 2 ? "completed" : ""}`}>
          <span className="step-number">02</span>
          <span>One ciphertext bit modified</span>
        </div>

        <div className={`tamper-step ${activeStep >= 3 ? "completed" : ""}`}>
          <span className="step-number">03</span>
          <span>Authentication attempted</span>
        </div>

        <div className={`tamper-step ${activeStep >= 4 ? "completed" : ""}`}>
          <span className="step-number">04</span>
          <span>Verification result displayed</span>
        </div>
      </div>

      <button
        className="primary-button"
        onClick={testTampering}
        disabled={!encryptedData || loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="spin" />
            Verifying Integrity...
          </>
        ) : (
          <>
            <ShieldAlert size={18} />
            Simulate Tampering
          </>
        )}
      </button>

      {!encryptedData && (
        <p className="panel-description">
          Encrypt a message first to enable the tamper test.
        </p>
      )}

      {encryptedData && modifiedCiphertext && (
        <CiphertextComparison
          original={encryptedData.ciphertext}
          modified={modifiedCiphertext}
        />
      )}

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

      {(result || modifiedCiphertext) && (
        <button
          className="secondary-button"
          onClick={resetTest}
          disabled={loading}
        >
          Reset Tamper Test
        </button>
      )}
    </section>
  );
}
