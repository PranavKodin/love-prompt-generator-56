
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toggleDarkMode } = useUser();
  const { toast } = useToast();

  const handleThemeChange = async (newTheme: string) => {
    try {
      // First update the local theme for immediate feedback
      setTheme(newTheme);
      
      // Then update user preferences in database for logged-in users
      if (newTheme === "dark" || newTheme === "light") {
        await toggleDarkMode().catch(err => {
          console.error("Failed to update user theme preference:", err);
          // If there's an error, we don't need to show a toast as updateProfile already does
        });
      }
    } catch (error) {
      console.error("Error changing theme:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme",
      });
    }
  };

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
            onClick={() => handleThemeChange("light")}
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
            onClick={() => handleThemeChange("dark")}
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
            onClick={() => handleThemeChange("system")}
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
