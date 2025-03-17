/**
 * Type definitions for the Classmate application
 */

import { DAYS_OF_WEEK, CLASS_TYPES } from './constants';

// Type for days of the week
export type Day = typeof DAYS_OF_WEEK[number];

// Type for class types
export type ClassType = typeof CLASS_TYPES[number];

// Class meeting type
export interface ClassMeeting {
  id?: number;
  day: Day;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Class type
export interface Class {
  id: number;
  title: string;
  type: ClassType;
  createdAt: string; // ISO date string
  meetings: ClassMeeting[];
}

// Data for creating a new class
export interface CreateClassData {
  title: string;
  type: ClassType;
  meetings: ClassMeeting[];
}

// Data for updating an existing class
export interface UpdateClassData {
  id: number;
  title: string;
  type: ClassType;
  meetings: ClassMeeting[];
}

// API Error type
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Component props types
export interface ClassListProps {
  classes: Class[];
  editClass: (classItem: Class) => void;
}

export interface ClassCalendarProps {
  classes: Class[];
}

// Context types
export interface ClassContextType {
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