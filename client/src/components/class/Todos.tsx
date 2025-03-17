"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassTodosProps {
  classId: number;
}

export default function ClassTodos({ classId }: ClassTodosProps) {
  // This will be implemented later to add a new todo
  const handleAddTodo = () => {
    console.log("Add todo for class:", classId);
    // This will be implemented to actually add a todo
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Todos
          </CardTitle>
          <Button
            onClick={handleAddTodo}
            variant="outline"
            size="sm"
            className="bg-primary hover:bg-zinc-800 hover:text-white text-white border-zinc-800"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center text-zinc-400">No todos available</div>
      </CardContent>
    </Card>
  );
}
