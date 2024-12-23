import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TeamMember } from "@/types/calendar";
import { User, UserX } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface TeamMemberListProps {
  members: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => void;
  onDeactivate: (memberId: string) => void;
}

const TeamMemberList = ({ members, onToggleAdmin, onDeactivate }: TeamMemberListProps) => {
  return (
    <div className="space-y-2">
      {members.map((member, index) => (
        <Draggable key={member.id} draggableId={member.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-center justify-between p-2 rounded-md border bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{member.full_name}</span>
                {member.is_admin && (
                  <Badge variant="secondary" className="ml-2">
                    Admin
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={member.is_admin}
                    onCheckedChange={() => onToggleAdmin(member.id, member.is_admin)}
                  />
                  <span className="text-sm text-muted-foreground">Admin</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeactivate(member.id)}
                >
                  <UserX className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default TeamMemberList;