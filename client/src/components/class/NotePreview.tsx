"use client";

import React from "react";
import { Note } from "@/lib/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface NotePreviewProps {
  note: Note;
  classId: number;
  onClick?: (note: Note) => void;
}

export default function NotePreview({
  note,
  classId,
  onClick,
}: NotePreviewProps) {
  const router = useRouter();

  // Format the date to be more readable
  const formattedDate = format(new Date(note.classDate), "MMM d, yyyy");

  const handleClick = () => {
    if (onClick) {
      onClick(note);
    } else {
      // Navigate to the note detail page with the flatter structure
      router.push(`/notes/${note.id}`);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-900/30 cursor-pointer hover:bg-zinc-800/30 transition-colors"
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-200">
          {note.classTitle}
        </span>
        <span className="text-xs text-zinc-400">{formattedDate}</span>
      </div>
    </div>
  );
}
