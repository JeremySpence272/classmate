import React, { useState, useEffect, useCallback, memo } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, Check, Trash2 } from "lucide-react";
import { useClassContext } from "@/context/ClassContext";
import { ClassMeeting, Day, ClassType } from "@/lib/types";
import { DAYS_OF_WEEK, CLASS_TYPES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

interface ClassFormProps {
  onCancel: () => void;
  onFormStateChange: (state: {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => Promise<void>;
  }) => void;
  classData?: {
    id: number;
    title: string;
    type: ClassType;
    meetings: ClassMeeting[];
  } | null;
}

interface MeetingTime {
  day: Day | "";
  startTime: string;
  endTime: string;
}

// Memoize the form to prevent unnecessary re-renders
const ClassForm = memo(
  ({ onCancel, onFormStateChange, classData }: ClassFormProps) => {
    const { createClass, updateClass } = useClassContext();
    const [title, setTitle] = useState(classData?.title || "");
    const [type, setType] = useState<ClassType | "">(classData?.type || "");
    const [currentMeeting, setCurrentMeeting] = useState<MeetingTime>({
      day: "",
      startTime: "",
      endTime: "",
    });
    const [lockedMeetings, setLockedMeetings] = useState<ClassMeeting[]>(
      classData?.meetings || []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!classData;

    // Update form fields when classData changes (for editing)
    useEffect(() => {
      if (classData) {
        setTitle(classData.title || "");
        setType(classData.type || "");
        setLockedMeetings(classData.meetings || []);
      }
    }, [classData]);

    // Define handleSubmit with useCallback to avoid recreation on each render
    const handleSubmit = useCallback(async () => {
      if (!title || !type) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (lockedMeetings.length === 0) {
        toast.error("At least one meeting time is required");
        return;
      }

      setIsSubmitting(true);

      try {
        if (isEditing && classData) {
          await updateClass({
            id: classData.id,
            title,
            type,
            meetings: lockedMeetings,
          });
        } else {
          await createClass({
            title,
            type,
            meetings: lockedMeetings,
          });
        }

        // Close form after successful submission
        onCancel();
      } catch (err) {
        console.error("Form submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }, [
      title,
      type,
      lockedMeetings,
      isEditing,
      classData,
      createClass,
      updateClass,
      onCancel,
    ]);

    // Update form state whenever relevant fields change
    useEffect(() => {
      const isValid =
        title.trim() !== "" && type !== "" && lockedMeetings.length > 0;

      onFormStateChange({
        isValid,
        isSubmitting,
        handleSubmit,
      });
    }, [
      title,
      type,
      lockedMeetings,
      isSubmitting,
      handleSubmit,
      onFormStateChange,
    ]);

    const isCurrentMeetingComplete = !!(
      currentMeeting.day &&
      currentMeeting.startTime &&
      currentMeeting.endTime
    );

    const addMeeting = useCallback(() => {
      if (!isCurrentMeetingComplete) return;

      // Convert MeetingTime to ClassMeeting by asserting the day is not empty
      const newMeeting: ClassMeeting = {
        day: currentMeeting.day as Day,
        startTime: currentMeeting.startTime,
        endTime: currentMeeting.endTime,
      };

      setLockedMeetings((prev) => [...prev, newMeeting]);
      setCurrentMeeting({ day: "", startTime: "", endTime: "" });
    }, [currentMeeting, isCurrentMeetingComplete]);

    const removeMeeting = useCallback((index: number) => {
      setLockedMeetings((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateCurrentMeeting = useCallback(
      (field: keyof MeetingTime, value: string) => {
        setCurrentMeeting((prev) => ({ ...prev, [field]: value }));
      },
      []
    );

    const handleTypeChange = useCallback((value: string) => {
      setType(value as ClassType);
    }, []);

    // Memoize the day selection callback
    const handleDayChange = useCallback(
      (value: string) => {
        updateCurrentMeeting("day", value as Day);
      },
      [updateCurrentMeeting]
    );

    // Memoize the start time change callback
    const handleStartTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCurrentMeeting("startTime", e.target.value);
      },
      [updateCurrentMeeting]
    );

    // Memoize the end time change callback
    const handleEndTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCurrentMeeting("endTime", e.target.value);
      },
      [updateCurrentMeeting]
    );

    return (
      <form className="flex gap-4 w-2/3" onSubmit={(e) => e.preventDefault()}>
        <Card className="flex-1 bg-transparent text-white border-zinc-800">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Class" : "Class Details"}</CardTitle>
            <CardDescription className="text-zinc-500">
              {isEditing
                ? "Edit the information about your class."
                : "Enter the basic information about your class."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="classTitle">Name</Label>
                <Input
                  id="classTitle"
                  className="bg-transparent text-white border-zinc-800"
                  placeholder="Name of your class"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="classType">Class Type</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger
                    className="w-full bg-transparent text-white border-zinc-800"
                    id="classType"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {CLASS_TYPES.map((classType) => (
                      <SelectItem
                        key={classType}
                        value={classType}
                        className="capitalize"
                      >
                        {classType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-transparent text-white border-zinc-800">
          <CardHeader>
            <CardTitle>Meeting Times</CardTitle>
            <CardDescription className="text-zinc-500">
              Schedule when your class meets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Locked meetings */}
              {lockedMeetings.map((meeting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 px-3 rounded-md border border-zinc-800 bg-zinc-900/30"
                >
                  <div className="text-sm flex items-center gap-4">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    <span className="capitalize text-zinc-200">
                      {meeting.day}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-200">
                      {formatTime(meeting.startTime)} -{" "}
                      {formatTime(meeting.endTime)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer h-6 w-6 text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => removeMeeting(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Current meeting form */}
              <div className="space-y-4 rounded-md border border-zinc-800 p-4">
                <div className="grid grid-cols-[1fr,auto,auto] gap-2 items-end">
                  <Select
                    value={currentMeeting.day}
                    onValueChange={handleDayChange}
                  >
                    <SelectTrigger className="w-full bg-transparent text-white border-zinc-800">
                      <SelectValue placeholder="Day">
                        {currentMeeting.day && (
                          <span className="capitalize">
                            {currentMeeting.day}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                          className="capitalize"
                        >
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    className="bg-transparent text-white border-zinc-800"
                    value={currentMeeting.startTime}
                    onChange={handleStartTimeChange}
                  />
                  <Input
                    type="time"
                    className="bg-transparent text-white border-zinc-800"
                    value={currentMeeting.endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
                {isCurrentMeetingComplete && (
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full border transition-colors ${
                      isCurrentMeetingComplete
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/20"
                        : "bg-transparent text-white border-zinc-800 hover:bg-zinc-800"
                    }`}
                    onClick={addMeeting}
                    disabled={!isCurrentMeetingComplete}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Meeting Time
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }
);

ClassForm.displayName = "ClassForm";

export default ClassForm;
