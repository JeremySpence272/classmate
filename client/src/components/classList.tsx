import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Class, useClassContext } from "@/context/ClassContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export interface ClassListProps {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  editClass: (classItem: Class) => void;
}

const ClassList: React.FC<ClassListProps> = ({
  classes,
  isLoading,
  error,
  editClass,
}) => {
  const { deleteClass } = useClassContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  React.useEffect(() => {
    console.log("Classes in ClassList component:", classes);
  }, [classes]);

  const handleDeleteClass = async (classItem: Class) => {
    setClassToDelete(classItem);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClass(classToDelete.id);
      toast.success(`${classToDelete.title} deleted successfully`);
    } catch (err) {
      toast.error(`Failed to delete ${classToDelete.title}`);
      console.error("Error deleting class:", err);
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

  if (isLoading) {
    return <div className="text-zinc-400">Loading classes...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (classes.length === 0) {
    return (
      <div className="text-zinc-400">No classes yet. Add your first class!</div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-2/3 ">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="bg-transparent border-zinc-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">{classItem.title}</CardTitle>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editClass(classItem)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(classItem)}
                    className="text-zinc-400 hover:text-red-500"
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
