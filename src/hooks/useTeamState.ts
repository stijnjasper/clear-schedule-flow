import { useState, useEffect } from "react";
import { TeamMember } from "@/types/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamState = () => {
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const queryClient = useQueryClient();

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      console.log('Fetching teams...');
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }

      return data;
    }
  });

  // Initialize openTeams state based on fetched teams
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    teams.forEach(team => {
      initialState[team.name] = true;
    });
    setOpenTeams(initialState);
  }, [teams]); // Only run when teams data changes

  // Fetch and subscribe to members
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('team', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      const transformedMembers: TeamMember[] = data.map(member => ({
        ...member,
        status: member.status as "active" | "deactivated",
        name: member.full_name,
        title: member.team ? `${member.team} Team Member` : 'Team Member',
        avatar: member.avatar_url || '',
      }));

      setTeamMembers(transformedMembers);
    };

    // Initial fetch
    fetchMembers();

    // Set up realtime subscription
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          // Instead of setting state directly, invalidate the query
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]); // Only depend on queryClient

  const toggleTeam = (team: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [team]: !prev[team],
    }));
  };

  return {
    teamMembers,
    openTeams,
    toggleTeam,
  };
};