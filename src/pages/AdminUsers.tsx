import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, Search, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import {
  getAllUsers,
  UserProfile,
  ADMIN_EMAIL
} from "@/lib/firebase";

// Define color options locally instead of importing from firebase
export const colorOptions = [
  { id: "love-500", color: "#e11d48", gradient: "linear-gradient(to right, #e11d48, #fb7185)" },
  { id: "pink-500", color: "#ec4899", gradient: "linear-gradient(to right, #ec4899, #f472b6)" },
  { id: "purple-500", color: "#8b5cf6", gradient: "linear-gradient(to right, #8b5cf6, #a78bfa)" },
  { id: "blue-500", color: "#3b82f6", gradient: "linear-gradient(to right, #3b82f6, #60a5fa)" },
  { id: "green-500", color: "#22c55e", gradient: "linear-gradient(to right, #22c55e, #4ade80)" },
  { id: "yellow-500", color: "#eab308", gradient: "linear-gradient(to right, #eab308, #facc15)" },
  { id: "orange-500", color: "#f97316", gradient: "linear-gradient(to right, #f97316, #fb923c)" },
  { id: "teal-500", color: "#14b8a6", gradient: "linear-gradient(to right, #14b8a6, #2dd4bf)" },
];

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to view this page",
      });
      navigate("/");
      return;
    }

    fetchUsers();
  }, [user, navigate, toast]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.location && user.location.toLowerCase().includes(term))
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getUserInitials = (name: string) => {
    if (!name) return "U";

    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const formatDate = (dateField) => {
    try {
      if (!dateField) return "Unknown";

      if (typeof dateField.toDate === 'function') {
        return dateField.toDate().toLocaleDateString();
      }

      if (dateField instanceof Date) {
        return dateField.toLocaleDateString();
      }

      if (typeof dateField === 'string' || typeof dateField === 'number') {
        return new Date(dateField).toLocaleDateString();
      }

      return "Unknown";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown";
    }
  };

  const getBannerStyle = (bannerURL: string | undefined) => {
    if (!bannerURL) return { background: "var(--gradient-love)" };
    
    if (bannerURL.startsWith('#')) {
      return { backgroundColor: bannerURL };
    }
    
    const colorOption = colorOptions.find(color => color.id === bannerURL);
    if (colorOption) {
      return { background: colorOption.gradient };
    }
    
    return { 
      backgroundImage: `url(${bannerURL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 container max-w-6xl mx-auto pt-28 pb-16 px-4">
        <div className="flex items-center mb-6">
          <Shield className="text-love-500 dark:text-love-400 mr-3 size-6" />
          <h1 className="text-3xl font-bold gradient-text">Admin Panel: User Management</h1>
        </div>

        <div className="flex justify-between items-center mb-8">
          <p className="text-foreground/70">
            Total users: <span className="font-medium">{users.length}</span>
          </p>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-10 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={clearSearch}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((user, index) => (
              <Card
                key={user.uid || index}
                className="overflow-hidden backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                <div 
                        className="absolute inset-0 rounded-lg overflow-hidden"
                        style={{ zIndex: -1 }}
                      >
                        <div 
                          className="absolute inset-0 blur-[2px]" 
                          style={{
                            ...getBannerStyle(user.bannerURL),
                            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)'
                          }}
                        ></div>
                      </div>
                  <div className="flex gap-3">
                    <Link to={`/profile/${user.uid}`}>
                      <Avatar className="size-14 border-2 border-love-200 dark:border-love-800 cursor-pointer transition-transform hover:scale-105 bg-background">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName || "User"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-love text-white">
                          {getUserInitials(user.displayName || "")}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 rounded-lg p-3 relative">
                      <h3 className="font-semibold text-base">
                        <Link
                          to={`/profile/${user.uid}`}
                          className="hover:text-love-600 dark:hover:text-love-400 transition-colors"
                        >
                          {user.displayName || "No Name"}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">{user.email || "No Email"}</p>
                      {user.location && (
                        <p className="text-xs text-foreground/70">
                          Location: {user.location}
                        </p>
                      )}
                      
                      {user.bio ? (
                        <p className="text-xs line-clamp-2 mt-1">{user.bio}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic mt-1">No bio</p>
                      )}
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground/5 rounded-full">
                          {user.subscription?.level === "premium" ? "Premium" : "Free"}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground/5 rounded-full">
                          {user.preferences?.darkMode ? "Dark mode" : "Light mode"}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground/5 rounded-full">
                          Joined: {formatDate(user.createdAt)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground/5 rounded-full">
                          Followers: {user.followersCount || 0}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground/5 rounded-full">
                          Following: {user.followingCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try a different search term" : "No users in the database"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminUsers;