"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { handleApiResponse, formatApiError } from "@/lib/api-middleware";
import {
  Note,
  NoteContextType,
  CreateNoteData,
  UpdateNoteData,
} from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

// Create the context with a default value
const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Provider component
export const NoteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Data state
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.NOTES);
      const data = await handleApiResponse<Note[]>(response);
      setNotes(data);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error("Error fetching notes:", err);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch notes for a specific class
  const fetchNotesByClass = useCallback(async (classId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.NOTES_BY_CLASS(classId));
      const data = await handleApiResponse<Note[]>(response);
      return data;
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error(`Error fetching notes for class ${classId}:`, err);
      toast.error("Failed to load notes for this class");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new note
  const createNote = useCallback(async (noteData: CreateNoteData) => {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const createdNote = await handleApiResponse<Note>(response);
      setNotes((prevNotes) => [createdNote, ...prevNotes]);
      toast.success("Note created successfully");
      return createdNote;
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error("Error creating note:", err);
      toast.error(errorMessage || "Failed to create note");
      throw err;
    }
  }, []);

  // Update an existing note
  const updateNote = useCallback(async (noteData: UpdateNoteData) => {
    try {
      const response = await fetch(API_ENDPOINTS.NOTES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const updatedNote = await handleApiResponse<Note>(response);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      toast.success("Note saved successfully");
      return updatedNote;
    } catch (err) {
      const errorMessage = formatApiError(err);
      console.error("Error updating note:", err);
      toast.error(errorMessage || "Failed to save note");
      throw err;
    }
  }, []);

  // The context value
  const contextValue = {
    notes,
    isLoading,
    error,
    fetchNotes,
    fetchNotesByClass,
    createNote,
    updateNote,
  };

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  );
};

// Custom hook to use the note context
export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
