import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import SidebarTooltip from "./SidebarTooltip";
import SidebarIcon from "./sidebar/SidebarIcon";
import ThemeToggle from "./sidebar/ThemeToggle";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out w-[72px]">
        <div className={cn(
          "m-4 flex flex-col items-center gap-4 rounded-2xl bg-white dark:bg-[#1b1b1b] shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out",
          "animate-in slide-in-from-left"
        )}>
          <div className={cn(
            "w-full",
            isExpanded ? "py-3" : "pt-0"
          )}>
            <SidebarTooltip label={isExpanded ? "Collapse Sidebar" : "Extend Sidebar"}>
              <SidebarIcon expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
            </SidebarTooltip>
          </div>

          {isExpanded && (
            <>
              <div className="px-3">
                <SidebarTooltip label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                  <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                </SidebarTooltip>
              </div>

              <div className="px-3">
                <SidebarTooltip label="Settings">
                  <button
                    className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </SidebarTooltip>
              </div>

              <Separator className="h-[1px] w-6 bg-[#B9B9B9] dark:bg-gray-600" />

              <div className="pb-3">
                <SidebarTooltip label="User Profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </SidebarTooltip>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;