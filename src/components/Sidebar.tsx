import { useState, useEffect } from "react";
import { ChevronLeft, Heart, History, User, Settings, Bookmark, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_EMAIL } from "@/lib/firebase";
import { Link } from "react-router-dom";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { name: "Public Compliments", path: "/public-compliments", icon: <Heart className="mr-2 h-4 w-4" />, requiresAuth: false },
    { name: "Profile", path: "/profile", icon: <User className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "Saved Compliments", path: "/saved-compliments", icon: <Bookmark className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "History", path: "/history", icon: <History className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-2 h-4 w-4" />, requiresAuth: true },
  ];

  const adminLinks = [
    { name: "User Management", path: "/admin/users", icon: <Shield className="mr-2 h-4 w-4" /> },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
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

          {/* Sidebar Links */}
          <div className="space-y-2">
            {links.map((link) => {
              if (link.requiresAuth && !user) return null;
              return (
                <Link to={link.path} key={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${
                      isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Admin Links */}
          {isAdmin && (
            <div className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">ADMIN</p>
              {adminLinks.map((link) => (
                <Link to={link.path} key={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${
                      isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Premium Features */}
          <div className="mt-auto">
            <div className="rounded-xl bg-gradient-to-r from-love-100 to-love-200 dark:from-love-800/30 dark:to-love-900/30 p-4 border border-love-200/50 dark:border-love-800/50 shadow-sm">
              <h3 className="font-medium text-love-800 dark:text-love-300 mb-2">Premium Features</h3>
              <p className="text-sm text-love-700/80 dark:text-love-300/80 mb-3">
                Unlock advanced customization options and save unlimited compliments.
              </p>
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