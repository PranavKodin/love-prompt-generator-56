
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-foreground/10"
        >
          {theme === "light" ? (
            <Sun size={20} className="text-love-700 animate-pulse-slow" />
          ) : theme === "dark" ? (
            <Moon size={20} className="text-love-400 animate-pulse-slow" />
          ) : (
            <Monitor size={20} className="text-love-600 dark:text-love-400 animate-pulse-slow" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-white/80 dark:bg-midnight-800/80 backdrop-blur-lg border border-border animate-fade-in">
        <div className="grid grid-cols-3 gap-2 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 rounded-md",
              theme === "light" && "bg-accent text-accent-foreground"
            )}
          >
            <Sun size={16} />
            <span className="text-xs">Light</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 rounded-md",
              theme === "dark" && "bg-accent text-accent-foreground"
            )}
          >
            <Moon size={16} />
            <span className="text-xs">Dark</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme("system")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 rounded-md",
              theme === "system" && "bg-accent text-accent-foreground"
            )}
          >
            <Monitor size={16} />
            <span className="text-xs">System</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
