"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotePreview from "./NotePreview";
import { Note } from "@/lib/types";
import { useNoteContext } from "@/context/NoteContext";

interface ClassNotesProps {
  classId: number;
}

export default function ClassNotes({ classId }: ClassNotesProps) {
  const { fetchNotesByClass } = useNoteContext();
  const [classNotes, setClassNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const notes = await fetchNotesByClass(classId);
        setClassNotes(notes);
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [classId, fetchNotesByClass]);

  // This will be implemented later to add a new note
  const handleAddNote = () => {
    console.log("Add note for class:", classId);
    // This will be implemented to actually add a note
  };

  // Handle clicking on a note preview - we'll keep this for potential future use
  // but the NotePreview will handle navigation itself
  const handleNoteClick = (note: Note) => {
    console.log("Selected note:", note);
    setSelectedNote(note);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Notes
          </CardTitle>
          <Button
            onClick={handleAddNote}
            variant="outline"
            size="sm"
            className="bg-primary hover:bg-zinc-800 hover:text-white text-white border-zinc-800"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent mx-auto"></div>
          </div>
        ) : classNotes.length > 0 ? (
          <div className="space-y-2">
            {classNotes.map((note) => (
              <NotePreview key={note.id} note={note} classId={classId} />
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-zinc-400">
            No notes for this class yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
