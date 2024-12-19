import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
}

const SidebarTooltip = ({ label, children }: SidebarTooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-background border-border text-foreground dark:bg-background dark:text-foreground"
          sideOffset={5}
        >
          <p className="text-sm font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarTooltip;