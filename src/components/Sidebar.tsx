
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, History, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const button = document.getElementById('sidebar-toggle');
      
      if (sidebar && button && 
          !sidebar.contains(event.target as Node) &&
          !button.contains(event.target as Node) && 
          isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sidebarItems = [
    { name: "Saved Compliments", icon: Heart },
    { name: "History", icon: History },
    { name: "Profile", icon: User },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed top-24 bottom-4 left-4 z-40 w-72 bg-white/90 dark:bg-midnight-900/90 backdrop-blur-lg rounded-2xl border border-border transition-all duration-500 ease-in-out transform shadow-xl",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0",
          "md:opacity-100 md:shadow-none md:translate-x-0 md:static md:w-64 md:h-auto md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:border-none"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-semibold gradient-text animate-pulse-slow">Preferences</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden rounded-full hover:bg-love-100/50 dark:hover:bg-love-900/30"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
          
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300"
              >
                <item.icon size={18} className="mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
          
          <div className="mt-auto">
            <div className="rounded-xl bg-gradient-to-r from-love-100 to-love-200 dark:from-love-800/30 dark:to-love-900/30 p-4 border border-love-200/50 dark:border-love-800/50 shadow-sm">
              <h3 className="font-medium text-love-800 dark:text-love-300 mb-2">Premium Features</h3>
              <p className="text-sm text-love-700/80 dark:text-love-300/80 mb-3">Unlock advanced customization options and save unlimited compliments.</p>
              <Button size="sm" className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300">
                <span className="animate-pulse-slow">Upgrade Now</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toggle button (shown only on mobile) */}
      <Button
        id="sidebar-toggle"
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "fixed left-4 bottom-4 z-50 rounded-full shadow-xl backdrop-blur-md bg-white/80 dark:bg-midnight-900/80 border border-border md:hidden transition-all duration-300",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Heart size={20} className="text-love-600 dark:text-love-400 animate-pulse-slow" />
      </Button>
    </>
  );
}
