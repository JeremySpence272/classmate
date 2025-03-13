import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "list" | "calendar";
  setViewMode: (mode: "list" | "calendar") => void;
}

const ViewToggle = memo(({ viewMode, setViewMode }: ViewToggleProps) => {
  // Create stable callbacks for the button clicks
  const setListView = useCallback(() => setViewMode("list"), [setViewMode]);
  const setCalendarView = useCallback(
    () => setViewMode("calendar"),
    [setViewMode]
  );

  return (
    <div className="flex gap-0 ">
      <Button
        style={{
          borderTopLeftRadius: "0.375rem",
          borderBottomLeftRadius: "0.375rem",
          borderTopRightRadius: "0rem",
          borderBottomRightRadius: "0rem",
        }}
        className={`border-1 border-zinc-800 w-10 h-10 flex items-center justify-center transition ${
          viewMode === "list"
            ? "bg-zinc-800 text-white"
            : "bg-transparent text-white"
        }`}
        onClick={setListView}
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        style={{
          borderTopRightRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
          borderTopLeftRadius: "0rem",
          borderBottomLeftRadius: "0rem",
        }}
        className={`border-1 border-zinc-800 w-10 h-10 flex items-center justify-center transition ${
          viewMode === "calendar"
            ? "bg-zinc-800 text-white"
            : "bg-transparent text-white"
        }`}
        onClick={setCalendarView}
      >
        <Calendar className="h-5 w-5" />
      </Button>
    </div>
  );
});

ViewToggle.displayName = "ViewToggle";

export default ViewToggle;
