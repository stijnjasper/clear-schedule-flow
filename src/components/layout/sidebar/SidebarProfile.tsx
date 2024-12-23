import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarTooltip from "../SidebarTooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SidebarProfile = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="pb-3">
      <SidebarTooltip label="User Profile">
        <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </SidebarTooltip>
    </div>
  );
};

export default SidebarProfile;