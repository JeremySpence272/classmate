"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import GlobalNav from "@/components/GlobalNav";
import { Card } from "@/components/ui/card";
import { markdownToStyledHtml } from "@/lib/utils";
import { API_ENDPOINTS } from "@/lib/constants";
import { handleApiResponse } from "@/lib/api-middleware";

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
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

  const handleEdit = () => {
    // This will be implemented for editing notes
    console.log("Edit note:", note?.id);
  };

  const handleDelete = () => {
    // This will be implemented for deleting notes
    if (window.confirm("Are you sure you want to delete this note?")) {
      console.log("Delete note:", note?.id);
      router.push(`/classes/${params.id}`); // Return to class page
    }
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

  if (!note) {
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

  // Convert markdown to styled HTML
  const contentHtml = markdownToStyledHtml(note.content);

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
          {/* <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="bg-transparent text-white border-zinc-800"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="bg-transparent hover:text-red-400 text-red-400 border-red-800/50 hover:bg-red-700/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div> */}
        </div>

        <Card className="p-6 border-zinc-800 bg-zinc-900/30">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </Card>

        <div className="mt-4 text-xs text-zinc-500">
          <p>Created: {formattedCreatedDate}</p>
          <p>Last updated: {formattedUpdatedDate}</p>
        </div>
      </div>
    </>
  );
}
