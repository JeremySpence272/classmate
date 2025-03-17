import React, { memo, useCallback } from "react";
import { Button } from "./ui/button";
import { Plus, X, Check } from "lucide-react";
import ViewToggle from "./ViewToggle";
import { useClassContext } from "@/context/ClassContext";

interface TitleComponentProps {
  onAddClass: () => void;
  isAddingClass: boolean;
  formState?: {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => Promise<void>;
  };
  viewMode: "list" | "calendar";
  setViewMode: (mode: "list" | "calendar") => void;
  isEditing: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const TitleComponent = memo(
  ({
    onAddClass,
    isAddingClass,
    formState,
    viewMode,
    setViewMode,
    isEditing,
  }: TitleComponentProps) => {
    const { cancelClassForm } = useClassContext();

    // Create stable references to the form state properties
    const handleSubmit = useCallback(async () => {
      if (formState?.handleSubmit) {
        await formState.handleSubmit();
      }
    }, [formState]);

    const isValid = formState?.isValid ?? false;
    const isSubmitting = formState?.isSubmitting ?? false;

    return (
      <div className="flex w-full justify-end items-center gap-4">
        <div className="flex gap-2">
          {isAddingClass || isEditing ? (
            <>
              <Button
                className="w-36 h-10 border-1 border-zinc-800 text-zinc-200 cursor-pointer hover:bg-zinc-800 relative"
                onClick={cancelClassForm}
              >
                <span className="absolute left-1/2 -translate-x-1/2 pr-6">
                  Cancel
                </span>
                <div className="absolute right-2 flex items-center">
                  <div className="w-[1px] h-4 bg-zinc-700 mr-2"></div>
                  <X className="h-4 w-4" />
                </div>
              </Button>
              <Button
                className={`w-36 h-10 relative ${
                  isValid
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                <span className="absolute left-1/2 -translate-x-1/2 pr-6">
                  {isEditing
                    ? isSubmitting
                      ? "Updating..."
                      : "Update Class"
                    : isSubmitting
                    ? "Creating..."
                    : "Create Class"}
                </span>
                <div className="absolute right-2 flex items-center">
                  <div className="w-[1px] h-4 bg-zinc-300 mr-2"></div>
                  <Check className="h-4 w-4" />
                </div>
              </Button>
            </>
          ) : (
            <Button
              className="w-36 h-10 border-1 border-zinc-800 text-zinc-200 cursor-pointer hover:bg-zinc-800 relative"
              onClick={onAddClass}
            >
              <span className="absolute left-1/2 -translate-x-1/2 pr-6">
                Add Class
              </span>
              <div className="absolute right-2 flex items-center">
                <div className="w-[1px] h-4 bg-zinc-700 mr-2"></div>
                <Plus className="h-4 w-4" />
              </div>
            </Button>
          )}
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    );
  }
);

TitleComponent.displayName = "TitleComponent";

export default TitleComponent;
