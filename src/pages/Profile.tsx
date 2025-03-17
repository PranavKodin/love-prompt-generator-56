
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Rocket, Heart, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Edit, MapPin, User } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { getFollowCounts } from "@/lib/firebase";

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set form fields when profile loads or changes
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      
      // Fetch follow counts
      if (user) {
        getFollowCounts(user.uid)
          .then(counts => setFollowCounts(counts))
          .catch(error => console.error("Error fetching follow counts:", error));
      }
    }
  }, [profile, user]);

  if (!user || !profile) {
    navigate("/get-started");
    return null;
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        displayName,
        bio,
        location,
      });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile changes",
      });
    }
  };

  const getUserInitials = () => {
    if (!profile.displayName) return "U";

    const nameParts = profile.displayName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors animate-fade-in">
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          <Card className="glass overflow-hidden animate-scale-in">
            <div className="h-40 bg-gradient-love relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 text-white" />
              </Button>
            </div>

            <div className="px-6 sm:px-10">
              <div className="relative -mt-16 flex justify-center sm:justify-start">
                <div className="relative">
                  <Avatar className="h-28 w-28 ring-4 ring-background border-2 border-love-400">
                    <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                    <AvatarFallback className="bg-gradient-love text-white text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <CardHeader className="pt-5 pb-0 px-0">
                {isEditing ? (
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="font-playfair text-2xl font-semibold"
                    placeholder="Your name"
                  />
                ) : (
                  <CardTitle className="font-playfair text-2xl md:text-3xl gradient-text">
                    {profile.displayName}
                  </CardTitle>
                )}

                <CardDescription className="flex items-center mt-1 text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  {profile.email}
                </CardDescription>

                {(profile.location || isEditing) && (
                  <CardDescription className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {isEditing ? (
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1"
                        placeholder="Your location"
                      />
                    ) : (
                      profile.location
                    )}
                  </CardDescription>
                )}
                
                <CardDescription className="flex items-center mt-2 space-x-3">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span className="font-semibold">{followCounts.followers}</span> 
                    <span className="ml-1 text-xs">Followers</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span className="font-semibold">{followCounts.following}</span> 
                    <span className="ml-1 text-xs">Following</span>
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 py-5">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">About</h3>
                  {isEditing ? (
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-24"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-foreground/80">
                      {profile.bio || "No bio yet."}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl">
                    <h3 className="text-sm font-semibold text-love-600 dark:text-love-400 mb-1">Account Type</h3>
                    <p className="text-foreground/80 capitalize">{profile.subscription?.level || "Free"}</p>
                  </div>

                  <div className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl">
                    <h3 className="text-sm font-semibold text-love-600 dark:text-love-400 mb-1">Member Since</h3>
                    <p className="text-foreground/80">
                      {profile.createdAt && new Date(profile.createdAt.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>

              {isEditing && (
                <CardFooter className="px-0 pt-0 pb-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDisplayName(profile.displayName);
                      setBio(profile.bio || "");
                      setLocation(profile.location || "");
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-gradient-love">
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
