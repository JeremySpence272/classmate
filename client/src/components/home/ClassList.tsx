import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Clock, Edit, Trash2, BookOpenText } from "lucide-react";
import { useClassContext } from "@/context/ClassContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Class, ClassListProps } from "@/lib/types";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";

import { mockBiologyNotes } from "@/lib/mock-notes";

const ClassList: React.FC<ClassListProps> = ({ classes, editClass }) => {
  const router = useRouter();
  const { deleteClass } = useClassContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState<number | null>(null);

  const handleDeleteClass = (classItem: Class, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setClassToDelete(classItem);
    setDialogOpen(true);
  };

  const handleEditClass = (classItem: Class, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    editClass(classItem);
  };

  const handleSeedNotes = async (classItem: Class, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking seed

    try {
      setIsSeeding(classItem.id);
      const createdNotes = [];

      // Use the existing notes endpoint to create each note
      for (const note of mockBiologyNotes) {
        const noteData = {
          ...note,
          classId: classItem.id,
        };

        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create note");
        }

        const result = await response.json();
        createdNotes.push(result);
      }

      toast.success(
        `${createdNotes.length} sample notes created for ${classItem.title}!`
      );
    } catch (error) {
      console.error("Error seeding notes:", error);
      toast.error("Failed to seed sample notes. Please try again.");
    } finally {
      setIsSeeding(null);
    }
  };

  const navigateToClass = (classId: number) => {
    router.push(`/classes/${classId}`);
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClass(classToDelete.id);
      // No need for toast here as it's handled in the context
    } catch (err) {
      // Error handling is now done in the context
      console.error("Delete confirmation error:", err);
    } finally {
      setIsDeleting(false);
      setClassToDelete(null);
      setDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setClassToDelete(null);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-2/3 ">
        {classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="bg-transparent border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
            onClick={() => navigateToClass(classItem.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center">
                  {classItem.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleSeedNotes(classItem, e)}
                    className="text-zinc-400 cursor-pointer hover:text-green-500"
                    disabled={isSeeding === classItem.id}
                    title="Seed sample notes"
                  >
                    <BookOpenText className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleEditClass(classItem, e)}
                    className="text-zinc-400 cursor-pointer hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClass(classItem, e)}
                    className="text-zinc-400 cursor-pointer hover:text-red-500"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <CardDescription className="text-zinc-500 capitalize">
                {classItem.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classItem.meetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-zinc-400"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="capitalize">{meeting.day}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {formatTime(meeting.startTime)} -{" "}
                      {formatTime(meeting.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently delete {classToDelete?.title} and all its
              meeting times. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800"
              onClick={cancelDelete}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClassList;
