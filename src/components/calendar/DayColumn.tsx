import React from "react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
}

interface DayColumnProps {
  day: string;
  team: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const DayColumn = ({ day, tasks, onDragOver, onDrop, onDragStart, onDragEnd }: DayColumnProps) => {
  return (
    <div
      className="p-4 border-r last:border-r-0 min-h-[120px] relative border-b last:border-b-0"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {tasks
        .filter((task) => task.day === day)
        .map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            subtitle={task.subtitle}
            color={task.color}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
    </div>
  );
};

export default DayColumn;