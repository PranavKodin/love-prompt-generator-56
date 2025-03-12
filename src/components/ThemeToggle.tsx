
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-10 h-10 transition-all duration-300"
    >
      {theme === "light" ? (
        <Sun size={20} className="text-love-700" />
      ) : (
        <Moon size={20} className="text-love-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
