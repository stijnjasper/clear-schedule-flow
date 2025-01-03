import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarNavigation from "./SidebarNavigation";
import SidebarActions from "./SidebarActions";
import SidebarProfile from "./SidebarProfile";
import { useProfileWithRealtime } from "@/hooks/useProfileWithRealtime";
import { supabase } from "@/integrations/supabase/client";

const SidebarContainer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { profile } = useProfileWithRealtime();

  useEffect(() => {
    if (profile?.sidebar_expanded !== undefined) {
      setIsExpanded(profile.sidebar_expanded);
    }
  }, [profile?.sidebar_expanded]);

  useEffect(() => {
    const handleThemeChange = () => {
      if (profile?.theme_preference === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const isDark = profile?.theme_preference === "dark";
        setIsDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    handleThemeChange();

    if (profile?.theme_preference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleThemeChange);
      };
    }
  }, [profile?.theme_preference]);

  const toggleSidebar = async () => {
    try {
      const newState = !isExpanded;
      setIsExpanded(newState);
      
      const { error } = await supabase
        .from('profiles')
        .update({ sidebar_expanded: newState })
        .eq('id', profile?.id);

      if (error) {
        console.error('[SidebarContainer] Error updating sidebar state:', error);
        throw error;
      }
    } catch (error) {
      console.error('[SidebarContainer] Error in toggleSidebar:', error);
    }
  };

  const toggleTheme = async () => {
    let newTheme;
    if (profile?.theme_preference === 'light') {
      newTheme = 'dark';
    } else if (profile?.theme_preference === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: newTheme })
        .eq('id', profile?.id);

      if (error) {
        console.error('[SidebarContainer] Error updating theme preference:', error);
        throw error;
      }
    } catch (error) {
      console.error('[SidebarContainer] Error in toggleTheme:', error);
    }
  };

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out w-[72px]">
        <div
          className={cn(
            "m-4 flex flex-col items-center gap-3 rounded-2xl bg-background shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out py-3",
            "animate-in slide-in-from-left"
          )}
        >
          <SidebarNavigation isExpanded={isExpanded} onToggle={toggleSidebar} />

          {isExpanded && (
            <>
              <div className="h-[1px] w-4 dark:bg-muted bg-border" />
              <SidebarActions 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={toggleTheme}
                themePreference={profile?.theme_preference}
              />
              <SidebarProfile />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarContainer;
