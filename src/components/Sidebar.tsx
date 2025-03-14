
import { useState, useEffect } from "react";
import { ChevronLeft, Heart, History, Settings, User, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubscriptionModal } from "./SubscriptionModal";
import { useUser } from "@/context/UserContext";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { user, logout } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user || !user.displayName) return "U";
    
    const nameParts = user.displayName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const sidebarItems = [
    { name: "Saved Compliments", icon: Heart, path: "/saved-compliments" },
    { name: "History", icon: History, path: "/history" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
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
          {user && (
            <div className="flex items-center gap-3 px-2 pb-4 mb-4 border-b border-border">
              <Avatar className="h-10 w-10 ring-2 ring-love-200 dark:ring-love-800">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-gradient-love text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-medium text-foreground">{user.displayName || "User"}</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-semibold gradient-text animate-pulse-slow">Menu</h2>
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
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to={item.path}>
                  <item.icon size={18} className="mr-2" />
                  {item.name}
                </Link>
              </Button>
            ))}
            
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            )}
          </div>
          
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
        </div>
      </div>
      
      <SubscriptionModal 
        isOpen={subscriptionModalOpen} 
        onClose={() => setSubscriptionModalOpen(false)} 
      />
    </>
  );
}
