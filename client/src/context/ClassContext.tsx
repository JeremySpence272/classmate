"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Import types from useClasses
export interface ClassMeeting {
  id?: number;
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface Class {
  id: number;
  title: string;
  type: "lecture" | "lab" | "seminar" | "discussion";
  created_at: string;
  meetings: ClassMeeting[];
}

interface CreateClassData {
  title: string;
  type: Class["type"];
  meetings: ClassMeeting[];
}

interface UpdateClassData {
  id: number;
  title: string;
  type: Class["type"];
  meetings: ClassMeeting[];
}

// Define the context state and functions
interface ClassContextType {
  // Data
  classes: Class[];
  isLoading: boolean;
  error: string | null;

  // UI State
  isAddingClass: boolean;
  isEditing: boolean;
  selectedClass: Class | null;

  // Functions
  fetchClasses: () => Promise<void>;
  createClass: (classData: CreateClassData) => Promise<Class>;
  updateClass: (classData: UpdateClassData) => Promise<Class>;
  deleteClass: (classId: number) => Promise<void>;
  startAddingClass: () => void;
  startEditingClass: (classItem: Class) => void;
  cancelClassForm: () => void;
}

// Create the context with a default value
const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Provider component
export const ClassProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Data state
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new class
  const createClass = useCallback(async (classData: CreateClassData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      if (!response.ok) throw new Error("Failed to create class");
      const newClass = await response.json();

      // Update state with new class
      setClasses((prevClasses) => {
        const updatedClasses = [newClass, ...prevClasses];
        console.log("Classes after create:", updatedClasses);
        return updatedClasses;
      });

      return newClass;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing class
  const updateClass = useCallback(
    async (classData: UpdateClassData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3001/api/classes/${classData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(classData),
          }
        );
        if (!response.ok) throw new Error("Failed to update class");
        const updatedClass = await response.json();

        // Update state with updated class
        setClasses((prevClasses) => {
          const updatedClasses = prevClasses.map((cls) =>
            cls.id === updatedClass.id ? updatedClass : cls
          );
          console.log("Classes after update:", updatedClasses);
          return updatedClasses;
        });

        // Force a re-fetch to ensure we have the latest data
        await fetchClasses();

        return updatedClass;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchClasses]
  );

  // Delete a class
  const deleteClass = useCallback(async (classId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/classes/${classId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete class");

      // Update state by removing the deleted class
      setClasses((prevClasses) => {
        const updatedClasses = prevClasses.filter((cls) => cls.id !== classId);
        console.log("Classes after delete:", updatedClasses);
        return updatedClasses;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    console.log("Editing class:", classItem);
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
