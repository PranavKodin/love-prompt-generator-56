
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { X, Heart, History, BookSaved, Settings, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/firebase";

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
    {
      name: "Love Stories",
      path: "/love-stories",
      icon: <Heart className="mr-2 h-4 w-4" />,
      requiresAuth: false,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
    {
      name: "Saved Compliments",
      path: "/saved-compliments",
      icon: <BookSaved className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
    {
      name: "History",
      path: "/history",
      icon: <History className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      requiresAuth: true,
    },
  ];

  const adminLinks = [
    {
      name: "User Management",
      path: "/admin/users",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/70 dark:bg-midnight-900/70 backdrop-blur-xl border-r border-white/10 dark:border-midnight-800/30 z-50 transition-transform duration-300 ease-in-out transform shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-midnight-800/30">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-love-600 dark:text-love-400" />
              <span className="ml-2 font-bold text-lg">LovelyAI</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              if (link.requiresAuth && !user) return null;
              
              return (
                <Link key={link.path} to={link.path} onClick={onClose}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-lg ${
                      isActivePath(link.path)
                        ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Button>
                </Link>
              );
            })}
            
            {isAdmin && (
              <div className="pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  ADMIN
                </p>
                {adminLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start rounded-lg ${
                        isActivePath(link.path)
                          ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300"
                          : "hover:bg-primary/10"
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-white/10 dark:border-midnight-800/30">
            <p className="text-xs text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} LovelyAI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
