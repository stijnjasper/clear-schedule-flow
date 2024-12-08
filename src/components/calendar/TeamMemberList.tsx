import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  team: string;
}

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  team: string;
}

const TeamMemberList = ({ teamMembers, team }: TeamMemberListProps) => {
  return (
    <div className="border-r border-b last:border-b-0 p-4">
      {teamMembers
        .filter((member) => member.team === team)
        .map((member) => (
          <div key={member.id} className="flex items-center gap-3 mb-4 last:mb-0">
            <Avatar>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium text-sm">{member.name}</div>
              <div className="text-xs text-muted-foreground">{member.title}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TeamMemberList;