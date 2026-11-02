import React, { useEffect, useState } from "react";
import { getLocalFile } from "./assignmentFiles";

function isPreviewable(file) {
  const contentType = file.contentType || "";
  return (
    contentType === "application/pdf" ||
    contentType.startsWith("image/")
  );
}

export default function AttachmentFiles({ files = [], title = "Attachments" }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );

  async function openFile(file, action) {
    setError("");
    try {
      const blob = await getLocalFile(file.storageRef);
      if (!blob) {
        setError(`${file.filename} is unavailable in this browser's local storage.`);
        return;
      }

      const url = URL.createObjectURL(blob);
      if (action === "preview" && isPreviewable(file)) {
        setPreview({ file, url });
        return;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (fileError) {
      console.error("Unable to open saved attachment.", fileError);
      setError(fileError.message || "Unable to open this attachment.");
    }
  }

  return (
    <section className="assignment-attachments">
      <h3>{title}</h3>
      {files.length ? (
        <ul>
          {files.map((file) => (
            <li key={file.id || file.storageRef}>
              <span>
                <strong>{file.filename}</strong>
                <small>
                  {file.contentType || "File"} ·{" "}
                  {Math.max(1, Math.round((file.size || 0) / 1024))} KB
                </small>
              </span>
              <div className="role-actions">
                {isPreviewable(file) && (
                  <button
                    type="button"
                    className="role-secondary"
                    onClick={() => openFile(file, "preview")}
                  >
                    Preview
                  </button>
                )}
                <button
                  type="button"
                  className="role-secondary"
                  onClick={() => openFile(file, "download")}
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="role-empty">No files attached.</p>
      )}
      {error && <p className="attachment-error" role="alert">{error}</p>}
      {preview && (
        <div className="submission-modal-backdrop" role="presentation">
          <section className="file-preview-modal" role="dialog" aria-modal="true">
            <header>
              <strong>{preview.file.filename}</strong>
              <button
                type="button"
                className="submission-modal-close"
                aria-label="Close preview"
                onClick={() => setPreview(null)}
              >
                ×
              </button>
            </header>
            {preview.file.contentType === "application/pdf" ? (
              <iframe title={preview.file.filename} src={preview.url} />
            ) : (
              <img src={preview.url} alt={preview.file.filename} />
            )}
          </section>
        </div>
      )}
    </section>
  );
}
