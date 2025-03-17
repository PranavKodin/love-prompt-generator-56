import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Rocket, Heart, Users, Image as ImageIcon, Palette, Camera, Edit, MapPin, User, Eye, EyeOff, ChevronDown, ChevronUp, ArrowRight, X, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { getFollowCounts } from "@/lib/firebase";
import { BannerSelector, colorOptions } from "@/components/BannerSelector";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, updateBanner } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [bannerSelectorOpen, setBannerSelectorOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");

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
        className: "animate-bounce-in"
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

  const handleBannerSelect = async (bannerUrl: string) => {
    try {
      await updateBanner(bannerUrl);
      setBannerSelectorOpen(false);
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner",
      });
    }
  };

  const renderBanner = () => {
    const selectedColor = colorOptions.find(c => c.id === profile.bannerURL);

    if (selectedColor) {
      return (
        <motion.div
          className="h-40 relative"
          style={{ background: selectedColor.gradient }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          {!isEditing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100"
              transition={{ duration: 0.3 }}
            ></motion.div>
          )}
        </motion.div>
      );
    }

    if (!profile.bannerURL || profile.bannerURL === "gradient") {
      return (
        <motion.div
          className="h-40 bg-gradient-love relative"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 dark:from-white/5 dark:to-black/30"></div>
          {!isEditing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100"
              transition={{ duration: 0.3 }}
            ></motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        className="h-40 relative overflow-hidden"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={profile.bannerURL}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        {!isEditing && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100"
            transition={{ duration: 0.3 }}
          ></motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-love-500 mb-6 transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              {/* Floating edit button */}
              <motion.div
                className="absolute top-2 right-2 z-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-md transition-all h-8 w-8 p-0 rounded-md border border-love-400/30"
                  onMouseEnter={() => setIsHoveringEdit(true)}
                  onMouseLeave={() => setIsHoveringEdit(false)}
                >
                  <Edit className="h-4 w-4 text-love-500" />
                </Button>

                <AnimatePresence>
                  {isHoveringEdit && (
                    <motion.div
                      className="absolute right-full mr-2 top-0 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      Edit Profile
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {renderBanner()}

              <div className="px-6 sm:px-10">
                <div className="relative -mt-20 sm:-mt-16 flex justify-between items-start">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar className="h-28 w-28 ring-4 ring-background border-2 border-love-400 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <AvatarImage src={profile.photoURL} alt={profile.displayName} />
                      <AvatarFallback className="bg-gradient-love text-white text-xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute bottom-0 right-0"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                    {!isEditing && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all duration-300"></div>
                    )}
                  </motion.div>
                </div>

                <CardHeader className="pt-5 pb-0 px-0">
                  {isEditing ? (
                    <motion.div
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="font-playfair text-2xl font-semibold focus:ring-2 focus:ring-love-500/50 transition-all"
                        placeholder="Your name"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardTitle className="font-playfair text-2xl md:text-3xl gradient-text">
                        {profile.displayName}
                      </CardTitle>
                    </motion.div>
                  )}

                  <CardDescription className="flex items-center mt-1 text-muted-foreground">
                    <User className="mr-1 h-3 w-3" />
                    {profile.email}
                  </CardDescription>

                  {(profile.location || isEditing) && (
                    <CardDescription className="flex items-center mt-1 text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {isEditing ? (
                        <motion.div
                          className="w-full"
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 focus:ring-2 focus:ring-love-500/50 transition-all"
                            placeholder="Your location"
                          />
                        </motion.div>
                      ) : (
                        profile.location
                      )}
                    </CardDescription>
                  )}

                  <motion.div
                    className="mt-2"
                    initial={{ height: showStats ? "auto" : "40px", opacity: 1 }}
                    animate={{ height: showStats ? "auto" : "40px", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardDescription
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => setShowStats(!showStats)}
                    >
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
                      {showStats ?
                        <ChevronUp className="h-3 w-3 ml-1 text-muted-foreground" /> :
                        <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                      }
                    </CardDescription>

                    <AnimatePresence>
                      {showStats && (
                        <motion.div
                          className="mt-3 grid grid-cols-2 gap-2 text-xs"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="bg-secondary/50 p-2 rounded-lg flex items-center justify-between">
                            <span>Posts</span>
                            <span className="font-semibold">User can't post for now</span>
                          </div>
                          <div className="bg-secondary/50 p-2 rounded-lg flex items-center justify-between">
                            <span>Likes</span>
                            <span className="font-semibold">No Post No Likes 🥲</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </CardHeader>

                <CardContent className="px-0 py-5">
                  <motion.div
                    className="mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                      About
                      {!isEditing && !profile.bio && (
                        <span className="ml-2 text-xs text-love-500/70">(Add your bio)</span>
                      )}
                    </h3>
                    {isEditing ? (
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="min-h-24 focus:ring-2 focus:ring-love-500/50 transition-all"
                          placeholder="Tell us about yourself..."
                        />
                      </motion.div>
                    ) : (
                      <motion.p
                        className="text-foreground/80 relative overflow-hidden"
                        initial={{ y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {profile.bio || "No bio yet."}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <motion.div
                      className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl hover:bg-secondary/70 transition-all duration-300"
                      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    >
                      <h3 className="text-sm font-semibold text-love-600 dark:text-love-400 mb-1 flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Account Type
                      </h3>
                      <p className="text-foreground/80 capitalize">
                        {profile.subscription?.level || "Free"}
                      </p>
                    </motion.div>

                    <motion.div
                      className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl hover:bg-secondary/70 transition-all duration-300"
                      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    >
                      <h3 className="text-sm font-semibold text-love-600 dark:text-love-400 mb-1 flex items-center">
                        <Rocket className="h-3 w-3 mr-1" />
                        Member Since
                      </h3>
                      <p className="text-foreground/80">
                        {profile.createdAt && new Date(profile.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Banner change option visible only when in edit mode */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setBannerSelectorOpen(true)}
                          className="w-full flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary/50 transition-all"
                        >
                          <Palette className="h-4 w-4 text-love-500" />
                          Change Banner
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardFooter className="px-0 pt-0 pb-6 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDisplayName(profile.displayName);
                            setBio(profile.bio || "");
                            setLocation(profile.location || "");
                            setIsEditing(false);
                          }}
                          className="flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="bg-gradient-love flex items-center gap-1 px-4 py-2 rounded transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                        >
                          Save Changes
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>

                      </CardFooter>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <BannerSelector
        open={bannerSelectorOpen}
        onOpenChange={setBannerSelectorOpen}
        currentBanner={profile.bannerURL || "gradient"}
        onSelect={handleBannerSelect}
      />
    </div>
  );
};

export default Profile;