interface Props {
  original: string;
  modified: string;
}

function decodeHex(value: string): string[] {
  const binary = atob(value);

  return Array.from(binary, char =>
    char.charCodeAt(0)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase()
  );
}

export default function CiphertextComparison({
  original,
  modified
}: Props) {
  const originalBytes = decodeHex(original);
  const modifiedBytes = decodeHex(modified);

  function renderBytes(bytes: string[]) {
    return (
      <div className="ciphertext-bytes">
        {bytes.slice(0, 24).map((byte, index) => (
          <span
            key={index}
            className={
              originalBytes[index] !== modifiedBytes[index]
                ? "changed-byte"
                : "normal-byte"
            }
          >
            {byte}
          </span>
        ))}
        {bytes.length > 24 && <span>...</span>}
      </div>
    );
  }

  return (
    <div className="ciphertext-comparison">
      <div className="comparison-block">
        <h3>Original Ciphertext</h3>
        {renderBytes(originalBytes)}
      </div>

      <div className="comparison-block">
        <h3>Modified Ciphertext</h3>
        {renderBytes(modifiedBytes)}
      </div>

      <p className="comparison-explanation">
        The highlighted byte contains a modified bit.
        AES-GCM authentication should reject the
        modified ciphertext.
      </p>
    </div>
  );
}
