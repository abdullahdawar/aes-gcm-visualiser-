import { useEffect, useState } from "react";
import {
  FileText,
  Lock,
  Binary,
  ShieldCheck,
  ArrowRight,
  Check
} from "lucide-react";
import type { EncryptedMessage } from "../types/crypto";

interface EncryptionFlowProps {
  encryptedData: EncryptedMessage | null;
}

const stages = [
  {
    title: "Plaintext",
    description: "Message converted to UTF-8 bytes",
    icon: FileText
  },
  {
    title: "AES-256-GCM",
    description: "Encryption using a 256-bit secret key",
    icon: Lock
  },
  {
    title: "Ciphertext",
    description: "Encrypted bytes generated",
    icon: Binary
  },
  {
    title: "Authentication",
    description: "128-bit authentication tag generated",
    icon: ShieldCheck
  }
];

export default function EncryptionFlow({
  encryptedData
}: EncryptionFlowProps) {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    if (!encryptedData) {
      setActiveStage(-1);
      return;
    }

    setActiveStage(0);

    let stage = 0;

    const interval = window.setInterval(() => {
      stage += 1;
      setActiveStage(stage);

      if (stage >= stages.length - 1) {
        window.clearInterval(interval);
      }
    }, 650);

    return () => window.clearInterval(interval);
  }, [encryptedData]);

  return (
    <section className="panel encryption-flow">
      <div className="panel-header">
        <div className="panel-title">
          <Lock size={20} />
          <h2>Encryption Visualization</h2>
        </div>
        <span className="status-badge">
          {encryptedData ? "Processing Complete" : "Awaiting Input"}
        </span>
      </div>

      <p className="panel-description">
        A visual representation of the AES-GCM encryption process.
      </p>

      <div className="flow-container">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const completed = activeStage > index;
          const active = activeStage === index;

          return (
            <div className="flow-item" key={stage.title}>
              <div
                className={`flow-stage ${
                  active ? "active" : ""
                } ${completed ? "completed" : ""}`}
              >
                <div className="flow-icon">
                  {completed ? (
                    <Check size={22} />
                  ) : (
                    <Icon size={22} />
                  )}
                </div>

                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </div>

              {index < stages.length - 1 && (
                <ArrowRight
                  size={20}
                  className={`flow-arrow ${
                    activeStage > index ? "arrow-active" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {encryptedData && (
        <div className="flow-result">
          <div className="result-heading">
            <ShieldCheck size={20} />
            Encryption Results
          </div>

          <div className="crypto-detail">
            <span>Ciphertext</span>
            <code>{encryptedData.ciphertext}</code>
          </div>

          <div className="crypto-detail">
            <span>Nonce (96-bit)</span>
            <code>{encryptedData.nonce}</code>
          </div>

          <div className="crypto-detail">
            <span>Authentication Tag (128-bit)</span>
            <code>{encryptedData.tag}</code>
          </div>
        </div>
      )}
    </section>
  );
}
