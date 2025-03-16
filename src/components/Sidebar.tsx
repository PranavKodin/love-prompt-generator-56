import { useState, useEffect } from "react";
import { ChevronLeft, Heart, History, User, Settings, Bookmark, Shield, Calendar, Sparkles, Clock, Users, LogOut, GiftIcon } from "lucide-react";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_EMAIL } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { SubscriptionModal } from "./SubscriptionModal";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { profile } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

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

  // Updated links based on first code structure
  const links = [
    { name: "Profile", path: "/profile", icon: <User className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "Saved Compliments", path: "/saved-compliments", icon: <Bookmark className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "History", path: "/history", icon: <History className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-2 h-4 w-4" />, requiresAuth: true },
  ];

  // Updated compliment features from first code
  const complimentLinks = [
    { name: "Discover Compliments", path: "/public-compliments", icon: <Sparkles className="mr-2 h-4 w-4" />, requiresAuth: false },
    { name: "Following Feed", path: "/following", icon: <Users className="mr-2 h-4 w-4" />, requiresAuth: true },
  ];

  // Updated relationship tools from first code
  const relationshipLinks = [
    { name: "Timeline", path: "/relationship-timeline", icon: <Calendar className="mr-2 h-4 w-4" />, requiresAuth: true },
    { name: "Surprise Ideas", path: "/surprises", icon: <GiftIcon className="mr-2 h-4 w-4" />, requiresAuth: true },
  ];

  const adminLinks = [
    { name: "Manage Users", path: "/admin/users", icon: <Shield className="mr-2 h-4 w-4" /> },
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

          {/* ACCOUNT section */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">ACCOUNT</p>
            {links.map((link) => {
              if (link.requiresAuth && !user) return null;
              return (
                <Link to={link.path} key={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
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

          {/* COMPLIMENTS section */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">COMPLIMENTS</p>
            {complimentLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              return (
                <Link to={link.path} key={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
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

          {/* RELATIONSHIP TOOLS section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">RELATIONSHIP TOOLS</p>
            {relationshipLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              return (
                <Link to={link.path} key={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
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
                    className={`w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 ${isActivePath(link.path) ? "bg-love-100 text-love-700 dark:bg-love-900/20 dark:text-love-300" : ""
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

          {/* Logout button */}
          {user && (
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground/80 hover:text-love-600 dark:hover:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-800/20 transition-all duration-300 mt-4"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}

          {/* Premium Features */}
          {user && (
            <div className="mt-auto">
              <div className="rounded-xl bg-gradient-to-r from-love-100 to-love-200 dark:from-love-800/30 dark:to-love-900/30 p-4 border border-love-200/50 dark:border-love-800/50 shadow-sm">
                <h3 className="font-medium text-love-800 dark:text-love-300 mb-2">Premium Features</h3>
                <p className="text-sm text-love-700/80 dark:text-love-300/80 mb-3">
                  {profile?.subscription?.level === "premium"
                    ? "You are enjoying premium benefits!"
                    : "Unlock advanced customization options and save unlimited compliments."}
                </p>
                {profile?.subscription?.level !== "premium" && (
                  <Button
                    size="sm"
                    className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300"
                    onClick={() => setSubscriptionModalOpen(true)}
                  >
                    <span className="animate-pulse-slow">Upgrade Now</span>
                  </Button>
                )}
                {profile?.subscription?.level === "premium" && (
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <CreditCard size={14} className="text-love-700 dark:text-love-300" />
                    <span className="text-love-700 dark:text-love-300">Premium Active</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
      />
    </>
  );
}