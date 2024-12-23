import { Moon, Sun, SunMoon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateTheme = useMutation({
    mutationFn: async () => {
      let newTheme: string;
      if (profile?.theme_preference === "system") {
        newTheme = isDarkMode ? "light" : "dark";
      } else if (profile?.theme_preference === "dark") {
        newTheme = "light";
      } else {
        newTheme = "system";
      }

      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", session?.user?.id);

      if (error) throw error;
      return newTheme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onToggle();
    },
  });

  const getIcon = () => {
    if (profile?.theme_preference === "system") {
      return <SunMoon className="h-5 w-5 text-foreground transition-colors" />;
    }
    return isDarkMode ? (
      <Sun className="h-5 w-5 text-foreground transition-colors" />
    ) : (
      <Moon className="h-5 w-5 text-foreground transition-colors" />
    );
  };

  const getTooltipText = () => {
    if (profile?.theme_preference === "system") {
      return "Using System Theme";
    }
    return isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => updateTheme.mutate()}
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
          aria-label={getTooltipText()}
        >
          {getIcon()}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-background border-border text-foreground dark:bg-background dark:text-foreground"
      >
        <p className="text-sm font-medium">{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;