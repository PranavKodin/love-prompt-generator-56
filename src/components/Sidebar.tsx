
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, History, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      
      if (sidebar && 
          !sidebar.contains(event.target as Node) && 
          isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

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
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed top-24 bottom-4 left-4 z-50 w-72 bg-white/90 dark:bg-midnight-900/90 backdrop-blur-lg rounded-2xl border border-border transition-all duration-500 ease-in-out transform shadow-xl",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-semibold gradient-text animate-pulse-slow">Preferences</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="rounded-full hover:bg-love-100/50 dark:hover:bg-love-900/30"
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
    </>
  );
}
