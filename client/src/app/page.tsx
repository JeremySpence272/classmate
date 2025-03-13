"use client";
import { Button } from "@/components/ui/button";
import ClassForm from "@/components/classForm";
import TitleComponent from "@/components/titleComponent";
import ClassList from "@/components/classList";
import ClassCalendar from "@/components/classCalendar";
import { useState, useEffect, useCallback } from "react";
import { useClassContext } from "@/context/ClassContext";

export default function Home() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [formState, setFormState] = useState<{
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => Promise<void>;
  }>({
    isValid: false,
    isSubmitting: false,
    handleSubmit: async () => {},
  });

  const {
    classes,
    isLoading,
    error,
    fetchClasses,
    isAddingClass,
    isEditing,
    selectedClass,
    startAddingClass,
    startEditingClass,
    cancelClassForm,
  } = useClassContext();

  // Initial fetch of classes
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Refetch classes when editing is complete
  useEffect(() => {
    if (!isEditing && !isAddingClass) {
      fetchClasses();
    }
  }, [isEditing, isAddingClass, fetchClasses]);

  // Log classes whenever they change
  useEffect(() => {
    console.log("Classes in Home component:", classes);
  }, [classes]);

  // Use useCallback to create a stable reference to the form state change handler
  const handleFormStateChange = useCallback(
    (state: {
      isValid: boolean;
      isSubmitting: boolean;
      handleSubmit: () => Promise<void>;
    }) => {
      setFormState(state);
    },
    []
  );

  // Use useCallback for view mode changes
  const handleViewModeChange = useCallback((mode: "list" | "calendar") => {
    setViewMode(mode);
  }, []);

  return (
    <main className="flex flex-col w-full items-center pt-8 gap-8">
      <div className="flex flex-row w-full mx-auto justify-center items-center gap-8">
        <TitleComponent
          onAddClass={startAddingClass}
          isAddingClass={isAddingClass || isEditing}
          formState={isAddingClass || isEditing ? formState : undefined}
          viewMode={viewMode}
          setViewMode={handleViewModeChange}
          isEditing={isEditing}
        />
      </div>
      {isAddingClass || isEditing ? (
        <ClassForm
          onCancel={cancelClassForm}
          onFormStateChange={handleFormStateChange}
          classData={selectedClass}
        />
      ) : viewMode === "list" ? (
        <ClassList
          classes={classes}
          isLoading={isLoading}
          error={error}
          editClass={startEditingClass}
        />
      ) : (
        <ClassCalendar classes={classes} />
      )}
    </main>
  );
}
