"use client";

import { useState } from "react";
import { splitText } from "@/lib/splitText";

const CHAR_LIMIT_OPTIONS = [140, 280, 500, 1000];

export default function Home() {
  const [text, setText] = useState("");
  const [maxLength, setMaxLength] = useState(140);
  const [chunks, setChunks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showMarkers, setShowMarkers] = useState(false);

  const handleSplit = () => {
    setChunks(splitText(text, maxLength));
    setCopiedIndex(null);
  };

  const getChunkWithMarker = (chunk: string, index: number) =>
    showMarkers ? `${chunk}\n[${index + 1}/${chunks.length}]` : chunk;

  const handleCopy = async (chunk: string, index: number) => {
    const content = getChunkWithMarker(chunk, index);
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback for browsers that block Clipboard API (e.g. non-HTTPS contexts).
      // document.execCommand is deprecated but widely supported as a fallback.
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const isOverLimit = text.length > maxLength;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">x_x</h1>
          <p className="text-sm text-gray-500 mt-1">
            Split long text into post-sized chunks at natural break points
          </p>
        </header>

        {/* Controls */}
        <section className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="maxLength"
              className="text-sm font-medium whitespace-nowrap"
            >
              Max characters
            </label>
            <select
              id="maxLength"
              value={maxLength}
              onChange={(e) => {
                setMaxLength(Number(e.target.value));
                setChunks([]);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-[var(--background)]"
            >
              {CHAR_LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} chars
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showMarkers"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="rounded"
              title="Append [current/total] page marker to each chunk"
            />
            <label
              htmlFor="showMarkers"
              className="text-sm font-medium whitespace-nowrap"
            >
              [*/n]
            </label>
          </div>
        </section>

        {/* Textarea */}
        <section className="mb-4">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setChunks([]);
            }}
            rows={8}
            placeholder="Enter your text here..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--background)] font-sans text-sm"
          />
          <div
            className={`text-xs text-right mt-1 ${
              isOverLimit ? "text-red-500 font-semibold" : "text-gray-400"
            }`}
          >
            {text.length} chars
            {isOverLimit && (
              <span className="ml-1">
                (exceeds limit — splitting required)
              </span>
            )}
          </div>
        </section>

        {/* Split button */}
        <section className="mb-8">
          <button
            onClick={handleSplit}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Split
          </button>
        </section>

        {/* Results */}
        {chunks.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-3">
              Split into {chunks.length} {chunks.length === 1 ? "post" : "posts"}
            </h2>
            <div className="space-y-4">
              {chunks.map((chunk, i) => {
                const content = getChunkWithMarker(chunk, i);
                return (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--background)]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">
                      {i + 1}&nbsp;/&nbsp;{chunks.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          content.length > maxLength
                            ? "text-red-500 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {content.length}&nbsp;/&nbsp;{maxLength}&nbsp;chars
                      </span>
                      <button
                        onClick={() => handleCopy(chunk, i)}
                        title={copiedIndex === i ? "Copied!" : "Copy to clipboard"}
                        aria-label={copiedIndex === i ? "Copied!" : "Copy to clipboard"}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        {copiedIndex === i ? (
                          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                          </svg>
                        ) : (
                          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <pre
                    className="whitespace-pre-wrap text-sm font-sans break-words leading-relaxed cursor-text select-text"
                    onDoubleClick={(e) => {
                      const selection = window.getSelection();
                      if (selection) {
                        const range = document.createRange();
                        range.selectNodeContents(e.currentTarget);
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                    }}
                  >
                    {content}
                  </pre>
                </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
