import React from "react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
  team: string;
}

interface DayColumnProps {
  day: string;
  team: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, team: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onCellClick: (day: string, team: string) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const DayColumn = ({ 
  day, 
  team, 
  tasks, 
  onDragOver, 
  onDrop, 
  onDragStart, 
  onDragEnd,
  onCellClick,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
}: DayColumnProps) => {
  const handleCellClick = (e: React.MouseEvent) => {
    // Prevent click when dragging
    if (e.target === e.currentTarget) {
      onCellClick(day, team);
    }
  };

  return (
    <div
      className="p-4 border-r last:border-r-0 min-h-[120px] relative border-b last:border-b-0 cursor-pointer"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day, team)}
      onClick={handleCellClick}
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
            onDuplicate={() => onDuplicateTask(task)}
            onCopyLink={() => onCopyLink(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
    </div>
  );
};

export default DayColumn;