import { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Code2,
  Activity
} from "lucide-react";

import SenderPanel from "./components/SenderPanel";
import RecipientPanel from "./components/RecipientPanel";
import EncryptionFlow from "./components/EncryptionFlow";
import SecurityDetails from "./components/SecurityDetails";
import TamperDetection from "./components/TamperDetection";

import type { EncryptedMessage } from "./types/crypto";

import "./App.css";

export default function App() {
  const [encryptedData, setEncryptedData] =
    useState<EncryptedMessage | null>(null);

  function handleEncrypted(data: EncryptedMessage) {
    setEncryptedData(data);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <LockKeyhole size={26} />
          </div>

          <div>
            <h1>AES-GCM Visualizer</h1>
            <p>Interactive Cryptographic Demonstration</p>
          </div>
        </div>

        <div className="header-status">
          <Activity size={16} />
          <span>Encryption Engine Ready</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            AES-256-GCM Encryption
          </div>

          <h2>
            Secure Communication,
            <span> Visualized.</span>
          </h2>

          <p>
            Explore how authenticated encryption transforms
            readable messages into protected ciphertext.
            Encrypt, inspect, and decrypt messages using
            AES-256-GCM.
          </p>
        </section>

        <div className="messaging-grid">
          <SenderPanel onEncrypted={handleEncrypted} />

          <RecipientPanel encryptedData={encryptedData} />
        </div>

        <EncryptionFlow encryptedData={encryptedData} />

        <TamperDetection encryptedData={encryptedData} />

        <SecurityDetails encryptedData={encryptedData} />
      </main>

      <footer className="app-footer">
        <div>
          <ShieldCheck size={17} />
          <span>AES-256-GCM Cryptographic Visualizer</span>
        </div>

        <div>
          <Code2 size={17} />
          <span>Educational Security Project</span>
        </div>
      </footer>
    </div>
  );
}
