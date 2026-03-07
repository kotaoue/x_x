"use client";

import { useState } from "react";
import { splitText } from "@/lib/splitText";

const CHAR_LIMIT_OPTIONS = [140, 280, 500, 1000];

export default function Home() {
  const [text, setText] = useState("");
  const [maxLength, setMaxLength] = useState(140);
  const [chunks, setChunks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSplit = () => {
    setChunks(splitText(text, maxLength));
    setCopiedIndex(null);
  };

  const handleCopy = async (chunk: string, index: number) => {
    try {
      await navigator.clipboard.writeText(chunk);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback for browsers that block Clipboard API (e.g. non-HTTPS contexts).
      // document.execCommand is deprecated but widely supported as a fallback.
      const el = document.createElement("textarea");
      el.value = chunk;
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
              {chunks.map((chunk, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-[var(--background)]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">
                      {i + 1}&nbsp;/&nbsp;{chunks.length}
                    </span>
                    <span
                      className={`text-xs ${
                        chunk.length > maxLength
                          ? "text-red-500 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      {chunk.length}&nbsp;/&nbsp;{maxLength}&nbsp;chars
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm font-sans break-words leading-relaxed">
                    {chunk}
                  </pre>
                  <button
                    onClick={() => handleCopy(chunk, i)}
                    className="mt-3 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-md transition-colors"
                  >
                    {copiedIndex === i ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
