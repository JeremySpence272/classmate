"use client";
import ClassForm from "@/components/ClassForm";
import TitleComponent from "@/components/TitleComponent";
import ClassList from "@/components/ClassList";
import ClassCalendar from "@/components/ClassCalendar";
import { useState, useEffect, useCallback } from "react";
import { useClassContext } from "@/context/ClassContext";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlobalNav from "@/components/GlobalNav";

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

  // Loading state
  const renderLoadingState = () => (
    <div className="w-2/3 flex justify-center items-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"></div>
    </div>
  );

  // Error state
  const renderErrorState = () => (
    <div className="w-2/3 flex justify-center items-center py-16">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
        <h3 className="text-red-400 font-semibold mb-2">
          Error Loading Classes
        </h3>
        <p className="text-zinc-400">{error}</p>
      </div>
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="w-2/3 flex justify-center items-center py-12">
      <Card className="bg-transparent border-zinc-800/50 w-full max-w-md">
        <CardContent className="pt-6 pb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800/30 flex items-center justify-center mb-6">
            <Calendar className="h-10 w-10 text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {viewMode === "list" ? "No classes yet" : "Your calendar is empty"}
          </h3>
          <p className="text-zinc-400 text-center mb-6 max-w-xs">
            {viewMode === "list"
              ? "Get started by adding your first class to organize your schedule"
              : "Add classes to see them displayed on your weekly calendar"}
          </p>
          <Button
            onClick={startAddingClass}
            className="bg-white text-zinc-950 hover:bg-zinc-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Class
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render content based on state
  const renderContent = () => {
    if (isAddingClass || isEditing) {
      return (
        <ClassForm
          onCancel={cancelClassForm}
          onFormStateChange={handleFormStateChange}
          classData={selectedClass}
        />
      );
    }

    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (classes.length === 0) {
      return renderEmptyState();
    }

    return viewMode === "list" ? (
      <ClassList classes={classes} editClass={startEditingClass} />
    ) : (
      <ClassCalendar classes={classes} />
    );
  };

  return (
    <>
      <GlobalNav>
        <TitleComponent
          onAddClass={startAddingClass}
          isAddingClass={isAddingClass || isEditing}
          formState={isAddingClass || isEditing ? formState : undefined}
          viewMode={viewMode}
          setViewMode={handleViewModeChange}
          isEditing={isEditing}
        />
      </GlobalNav>
      <main className="flex flex-col w-full items-center pt-8 gap-8">
        {renderContent()}
      </main>
    </>
  );
}
