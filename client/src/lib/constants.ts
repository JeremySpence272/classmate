/**
 * Constants for the Classmate application
 */

// Class types
export const CLASS_TYPES = ['lecture', 'lab', 'seminar', 'discussion'] as const;

// Days of the week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// Colors for different class types
export const CLASS_TYPE_COLORS = {
  lecture: {
    bg: "bg-[#16b3d4]", // Soft teal
    border: "border-[#0e7a8f]", // Darker teal
  },
  lab: {
    bg: "bg-[#feca14]", // Soft yellow
    border: "border-[#d9a800]", // Darker yellow
  },
  seminar: {
    bg: "bg-[#ec745c]", // Soft coral
    border: "border-[#c85240]", // Darker coral
  },
  discussion: {
    bg: "bg-[#e85484]", // Soft pink
    border: "border-[#c03a68]", // Darker pink
  },
};

// Time constants
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const DEFAULT_START_HOUR = 8; // 8 AM
export const DEFAULT_END_HOUR = 18; // 6 PM

// API endpoints
export const API_ENDPOINTS = {
  CLASSES: '/api/classes',
  CLASS: (id: number) => `/api/classes/${id}`,
}; 