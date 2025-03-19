"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Note, EditorContent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import GlobalNav from "@/components/GlobalNav";
import { API_ENDPOINTS } from "@/lib/constants";
import { handleApiResponse } from "@/lib/api-middleware";
import TipTapEditor from "@/components/editor/Editor";
import { normalizeContent } from "@/lib/editor-utils";
import { JSONContent } from "@tiptap/react";

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      setIsLoading(true);

      try {
        // Get the note ID from the URL parameters
        const noteId = parseInt(params.noteId as string, 10);
        const classId = parseInt(params.id as string, 10);

        // Fetch the note using the API endpoint
        const response = await fetch(API_ENDPOINTS.NOTE(noteId));

        if (!response.ok) {
          // If the note doesn't exist, show an error
          setError("Note not found");
          setIsLoading(false);
          return;
        }

        const noteData = await handleApiResponse<Note>(response);
        setNote(noteData);

        // Process the content for the editor
        if (noteData.content) {
          try {
            // Handle different content formats
            if (typeof noteData.content === "object") {
              if (noteData.content.type === "doc") {
                // It's already in the right format, just use it directly
                setEditorContent(noteData.content as unknown as JSONContent);
              } else if (
                "content" in noteData.content &&
                typeof noteData.content.content === "object"
              ) {
                // This is likely an EditorContent object with nested content
                // Extract the content array for the editor
                setEditorContent(
                  noteData.content.content as unknown as JSONContent
                );
              } else {
                // Unknown object format, try to normalize
                const normalized = normalizeContent(noteData.content);
                setEditorContent(normalized as unknown as JSONContent);
              }
            } else if (typeof noteData.content === "string") {
              // Convert string content to JSONContent
              const normalized = normalizeContent(noteData.content);
              setEditorContent(normalized as unknown as JSONContent);
            } else {
              // Fallback to empty content
              console.warn("Unknown content format");
              setEditorContent(null);
            }
          } catch (err) {
            console.error("Error processing note content:", err);
            setError("Failed to process note content");
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error loading note:", err);
        setError("Failed to load note data");
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [params.noteId, params.id]);

  const handleBack = () => {
    router.push(`/classes/${params.id}`);
  };

  const handleEditorChange = (html: string) => {
    // Just log the content change for now, we'll implement saving later
    console.log("Editor content changed:", html);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-semibold mb-2">Error</h3>
          <p className="text-zinc-400">{error}</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="mt-4 bg-transparent text-white border-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class
          </Button>
        </div>
      </div>
    );
  }

  if (!note || !editorContent) {
    return null;
  }

  // Format dates for display
  const formattedClassDate = format(new Date(note.classDate), "MMMM d, yyyy");
  const formattedCreatedDate = format(
    new Date(note.createdAt),
    "MMM d, yyyy h:mm a"
  );
  const formattedUpdatedDate = format(
    new Date(note.updatedAt),
    "MMM d, yyyy h:mm a"
  );

  // Add debugging log to see the editorContent structure
  console.log("Editor content type:", typeof editorContent);
  console.log("Editor content:", editorContent);

  return (
    <>
      <GlobalNav>
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-primary hover:bg-zinc-800 hover:text-white text-white border-zinc-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Class
        </Button>
      </GlobalNav>

      <div className="container w-2/3 mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white">{note.classTitle}</h1>
            <h3 className="text-md mt-2 font-medium text-zinc-400">
              {formattedClassDate}
            </h3>
          </div>
        </div>

        <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-sm text-zinc-300">
          <div className="flex items-center gap-4">
            <div className="w-[3%] flex justify-center">
              <span className="text-xl">💡</span>
            </div>
            <div className="w-[97%]">
              <p>
                Use the bubble menu (appears when selecting text) for quick
                formatting. Try the slash command (type{" "}
                <code className="px-1.5 py-0.5 bg-zinc-700/50 rounded text-xs">
                  /
                </code>
                ) for advanced features like tables and images.
              </p>
            </div>
          </div>
        </div>

        {/* Use your existing TipTap editor */}
        <TipTapEditor
          initialContent={editorContent}
          darkMode={true}
          onChange={handleEditorChange}
        />

        <div className="mt-4 text-xs text-zinc-500">
          <p>Created: {formattedCreatedDate}</p>
          <p>Last updated: {formattedUpdatedDate}</p>
        </div>
      </div>
    </>
  );
}
