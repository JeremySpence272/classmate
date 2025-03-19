"use client";
import { useState } from "react";
import GlobalNav from "@/components/GlobalNav";
import TipTapEditor from "@/components/editor/Editor";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  const handleEditorChange = (html: string) => {
    setContent(html);
    // You can do other things with the content here, like saving to localStorage
    console.log("Editor content updated");
  };

  return (
    <>
      <GlobalNav>
        <h1 className="text-3xl font-bold text-white">Editor Demo</h1>
      </GlobalNav>
      <main className="flex flex-col items-center w-full py-6">
        <div className="w-full max-w-4xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              TipTap WYSIWYG Editor
            </h2>
            <p className="text-zinc-400 mb-4">
              A customizable rich text editor with Markdown-like formatting. Try
              out the formatting options in the toolbar above.
            </p>
            <div className="flex items-center">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded border border-zinc-700"
              >
                {showDebug ? "Hide HTML Output" : "Show HTML Output"}
              </button>
            </div>
          </div>

          <TipTapEditor darkMode={true} onChange={handleEditorChange} />

          {showDebug && (
            <div className="mt-8 p-4 bg-zinc-800 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">
                HTML Output:
              </h2>
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap break-all overflow-x-auto p-3 bg-zinc-900 rounded border border-zinc-700 max-h-80">
                {content}
              </pre>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
