"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClassContext } from "@/context/ClassContext";
import { Class } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import GlobalNav from "@/components/GlobalNav";

export default function ClassPage() {
  const params = useParams();
  const router = useRouter();
  const { classes, fetchClasses, startEditingClass, deleteClass } =
    useClassContext();
  const [classData, setClassData] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClass = async () => {
      setIsLoading(true);
      try {
        // If we don't have classes loaded yet, fetch them
        if (classes.length === 0) {
          await fetchClasses();
        }

        // Find the class with the matching ID
        const id = parseInt(params.id as string, 10);
        const foundClass = classes.find((c) => c.id === id);

        if (foundClass) {
          setClassData(foundClass);
          setError(null);
        } else {
          setError("Class not found");
        }
      } catch (err) {
        console.error("Error loading class:", err);
        setError("Failed to load class data");
      } finally {
        setIsLoading(false);
      }
    };

    loadClass();
  }, [params.id, classes, fetchClasses]);

  const handleEdit = () => {
    if (classData) {
      startEditingClass(classData);
      router.push("/"); // Navigate back to home where the edit form will be shown
    }
  };

  const handleDelete = async () => {
    if (
      classData &&
      window.confirm("Are you sure you want to delete this class?")
    ) {
      try {
        await deleteClass(classData.id);
        router.push("/"); // Navigate back to home after deletion
      } catch (err) {
        console.error("Error deleting class:", err);
      }
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"></div>
      </div>
    );
  }

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
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  if (!classData) {
    return null;
  }

  return (
    <>
      <GlobalNav>
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-primary hover:bg-zinc-800 hover:text-white text-white border-zinc-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
      </GlobalNav>

      <div className="container w-2/3 mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{classData.title}</h1>
          <div className="flex gap-2">
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
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-row justify-between bg-transparent text-white border-zinc-800">
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription className="text-zinc-500">
                Basic information about this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-8 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400">
                    Class Type
                  </h3>
                  <p className="text-white capitalize">{classData.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400">Created</h3>
                  <p className="text-white">
                    {new Date(classData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent text-white border-zinc-800">
            <CardHeader>
              <CardTitle>Meeting Schedule</CardTitle>
              <CardDescription className="text-zinc-500">
                When this class meets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classData.meetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="flex items-center py-2 px-3 rounded-md border border-zinc-800 bg-zinc-900/30"
                  >
                    <div className="text-sm flex items-center gap-4">
                      <span className="capitalize text-zinc-200">
                        {meeting.day}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-200">
                        {formatTime(meeting.startTime)} -{" "}
                        {formatTime(meeting.endTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
