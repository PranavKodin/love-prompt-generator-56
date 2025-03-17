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
import {
  getAllUsers,
  UserProfile,
  ADMIN_EMAIL
} from "@/lib/firebase";

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Check if user is admin
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
    
    // Fetch users
    fetchUsers();
  }, [user, navigate, toast]);
  
  // Apply search filter when searchTerm changes
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
  
  // Helper function to safely format date
  const formatDate = (dateField) => {
    try {
      if (!dateField) return "Unknown";
      
      // Check if it's a Firebase timestamp (has toDate method)
      if (typeof dateField.toDate === 'function') {
        return dateField.toDate().toLocaleDateString();
      }
      
      // If it's already a Date object
      if (dateField instanceof Date) {
        return dateField.toLocaleDateString();
      }
      
      // If it's a string or number timestamp
      if (typeof dateField === 'string' || typeof dateField === 'number') {
        return new Date(dateField).toLocaleDateString();
      }
      
      return "Unknown";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 backdrop-blur-3xl bg-background/80 -z-10 hero-gradient" />
      
      <Navbar toggleSidebar={() => {}} />
      
      <main className="flex-1 container max-w-4xl mx-auto pt-28 pb-16 px-4">
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
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers.map((user, index) => (
              <Card 
                key={user.uid || index} 
                className="overflow-hidden backdrop-blur-sm bg-white/20 dark:bg-midnight-900/20 border-white/20 dark:border-midnight-800/30 hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="size-16 border-2 border-love-200 dark:border-love-800">
                      <AvatarImage 
                        src={user.photoURL || ""} 
                        alt={user.displayName || "User"} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-love text-white">
                        <Link to={`/profile/${user.uid}`} className="flex items-center space-x-2">
                        {getUserInitials(user.displayName || "")}
                        </Link>
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {user.displayName || "No Name"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{user.email || "No Email"}</p>
                      {user.location && (
                        <p className="text-sm text-foreground/70">
                          Location: {user.location}
                        </p>
                      )}
                      <div className="mt-2">
                        {user.bio ? (
                          <p className="text-sm line-clamp-2">{user.bio}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No bio</p>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
                          {user.subscription?.level === "premium" ? "Premium" : "Free"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
                          {user.preferences?.darkMode ? "Dark mode" : "Light mode"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
                          Joined: {formatDate(user.createdAt)}
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