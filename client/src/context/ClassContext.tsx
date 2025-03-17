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
  Class,
  ClassContextType,
  CreateClassData,
  UpdateClassData,
} from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

// Create the context with a default value
const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Provider component
export const ClassProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Data state
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Initial fetch of classes
  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.CLASSES);
      const data = await handleApiResponse<Class[]>(response);
      setClasses(data);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error("Error fetching classes:", err);
      toast.error("Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new class with optimistic update
  const createClass = useCallback(async (classData: CreateClassData) => {
    // Generate a temporary ID for optimistic update
    const tempId = Date.now();

    // Create optimistic class object
    const optimisticClass: Class = {
      id: tempId,
      title: classData.title,
      type: classData.type,
      createdAt: new Date().toISOString(),
      meetings: classData.meetings.map((meeting, index) => ({
        ...meeting,
        id: index,
      })),
    };

    // Optimistically update UI
    setClasses((prevClasses) => [optimisticClass, ...prevClasses]);

    try {
      // Make actual API call
      const response = await fetch(API_ENDPOINTS.CLASSES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      const newClass = await handleApiResponse<Class>(response);

      // Replace optimistic class with real one from server
      setClasses((prevClasses) =>
        prevClasses.map((cls) => (cls.id === tempId ? newClass : cls))
      );

      toast.success(`${newClass.title} created successfully`);
      return newClass;
    } catch (err) {
      // Rollback optimistic update on error
      setClasses((prevClasses) =>
        prevClasses.filter((cls) => cls.id !== tempId)
      );

      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error("Error creating class:", err);
      toast.error(`Failed to create class: ${errorMessage}`);
      throw err;
    }
  }, []);

  // Update an existing class with optimistic update
  const updateClass = useCallback(
    async (classData: UpdateClassData) => {
      // Store original class for potential rollback
      const originalClass = classes.find((cls) => cls.id === classData.id);
      if (!originalClass) {
        const errorMsg = `Class with ID ${classData.id} not found`;
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Create updated class object
      const updatedClass: Class = {
        ...originalClass,
        title: classData.title,
        type: classData.type,
        meetings: classData.meetings,
      };

      // Optimistically update UI
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === updatedClass.id ? updatedClass : cls
        )
      );

      try {
        // Make actual API call
        const response = await fetch(API_ENDPOINTS.CLASS(classData.id), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(classData),
        });

        const serverClass = await handleApiResponse<Class>(response);

        // Update with server data (in case there were any differences)
        setClasses((prevClasses) =>
          prevClasses.map((cls) =>
            cls.id === serverClass.id ? serverClass : cls
          )
        );

        toast.success(`${serverClass.title} updated successfully`);
        return serverClass;
      } catch (err) {
        // Rollback optimistic update on error
        if (originalClass) {
          setClasses((prevClasses) =>
            prevClasses.map((cls) =>
              cls.id === originalClass.id ? originalClass : cls
            )
          );
        }

        const errorMessage = formatApiError(err);
        setError(errorMessage);
        console.error("Error updating class:", err);
        toast.error(`Failed to update class: ${errorMessage}`);
        throw err;
      }
    },
    [classes]
  );

  // Delete a class with optimistic update
  const deleteClass = useCallback(
    async (classId: number) => {
      // Store original class for potential rollback
      const originalClass = classes.find((cls) => cls.id === classId);
      if (!originalClass) {
        const errorMsg = `Class with ID ${classId} not found`;
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Optimistically update UI
      setClasses((prevClasses) =>
        prevClasses.filter((cls) => cls.id !== classId)
      );

      try {
        // Make actual API call
        const response = await fetch(API_ENDPOINTS.CLASS(classId), {
          method: "DELETE",
        });

        await handleApiResponse(response);
        toast.success(`${originalClass.title} deleted successfully`);
      } catch (err) {
        // Rollback optimistic update on error
        if (originalClass) {
          setClasses((prevClasses) => [...prevClasses, originalClass]);
        }

        const errorMessage = formatApiError(err);
        setError(errorMessage);
        console.error("Error deleting class:", err);
        toast.error(`Failed to delete class: ${errorMessage}`);
        throw err;
      }
    },
    [classes]
  );

  // UI state management functions
  const startAddingClass = useCallback(() => {
    setIsAddingClass(true);
    setIsEditing(false);
    setSelectedClass(null);
  }, []);

  const startEditingClass = useCallback((classItem: Class) => {
    setIsEditing(true);
    setSelectedClass(classItem);
    setIsAddingClass(false);
  }, []);

  const cancelClassForm = useCallback(() => {
    setIsAddingClass(false);
    setIsEditing(false);
    setSelectedClass(null);
  }, []);

  // Create the context value object
  const contextValue: ClassContextType = {
    // Data
    classes,
    isLoading,
    error,

    // UI State
    isAddingClass,
    isEditing,
    selectedClass,

    // Functions
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    startAddingClass,
    startEditingClass,
    cancelClassForm,
  };

  return (
    <ClassContext.Provider value={contextValue}>
      {children}
    </ClassContext.Provider>
  );
};

// Custom hook to use the context
export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};
