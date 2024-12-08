import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeamMemberList from "./calendar/TeamMemberList";
import DayColumn from "./calendar/DayColumn";
import WeekHeader from "./calendar/WeekHeader";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { addWeeks, subWeeks } from "date-fns";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
  team: string;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  team: string;
}

const Timeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Review",
      subtitle: "UI Suite Pages",
      assignee: "Sarah Chen",
      day: "Mon",
      color: "bg-[#34C759]/10 border-[#34C759]/20",
      team: "Design"
    },
    {
      id: "2",
      title: "Team Meeting",
      subtitle: "Sprint Planning",
      assignee: "Mike Johnson",
      day: "Wed",
      color: "bg-[#FF9500]/10 border-[#FF9500]/20",
      team: "Development"
    },
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Lead Designer",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      team: "Design",
    },
    {
      id: "2",
      name: "Mike Johnson",
      title: "Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      team: "Development",
    },
    {
      id: "3",
      name: "Emma Davis",
      title: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      team: "Marketing",
    },
  ]);

  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({
    Marketing: true,
    Development: true,
    Design: true,
  });

  const handlePreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDay: string, targetTeam: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, day: targetDay, team: targetTeam }
          : task
      )
    );
  };

  const toggleTeam = (team: string) => {
    setOpenTeams(prev => ({
      ...prev,
      [team]: !prev[team]
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 space-y-6 animate-fade-in">
      <WeekHeader 
        currentDate={currentDate}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <div className="relative overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="grid grid-cols-[200px_1fr]">
          <div className="p-4 bg-muted border-b font-medium">People</div>
          <div className="grid grid-cols-5 border-b bg-muted">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
              <div key={day} className="p-4 border-r last:border-r-0">
                <div className="font-medium">{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {["Marketing", "Development", "Design"].map((team) => (
            <Collapsible
              key={team}
              open={openTeams[team]}
              onOpenChange={() => toggleTeam(team)}
            >
              <CollapsibleTrigger className="w-full">
                <div className={`flex items-center gap-2 p-2 bg-muted/50 border-b hover:bg-muted/80 transition-colors ${
                  team === "Marketing" ? "bg-orange-50" : 
                  team === "Development" ? "bg-blue-50" : 
                  "bg-green-50"
                }`}>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openTeams[team] ? "transform rotate-180" : ""}`} />
                  <span className="font-medium">{team}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-[200px_1fr]">
                  <TeamMemberList teamMembers={teamMembers} team={team} />
                  <div className="grid grid-cols-5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                      <DayColumn
                        key={`${team}-${day}`}
                        day={day}
                        team={team}
                        tasks={tasks.filter(task => task.team === team)}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;