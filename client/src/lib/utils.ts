import { ClassType } from "@/lib/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a time string from 24-hour format (HH:MM) to 12-hour format with AM/PM
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Gets the appropriate CSS classes for a class type
 */
export function getClassTypeStyles(type: ClassType): { bg: string; border: string } {
  const styles = {
    lecture: {
      bg: "bg-blue-800",
      border: "border-blue-950",
    },
    lab: {
      bg: "bg-green-800",
      border: "border-green-950",
    },
    seminar: {
      bg: "bg-amber-800",
      border: "border-amber-950",
    },
    discussion: {
      bg: "bg-purple-800",
      border: "border-purple-950",
    },
  };

  return styles[type] || { bg: "bg-zinc-800", border: "border-zinc-950" };
}
