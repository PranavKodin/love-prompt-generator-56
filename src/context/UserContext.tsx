import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Timestamp } from "firebase/firestore";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  upgradeSubscription: () => Promise<void>;
  updateBanner: (bannerUrl: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { setTheme } = useTheme();

  // Load user profile when auth user changes
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          let userProfile = await getUserProfile(user.uid);
          
          if (!userProfile) {
            // Create a new profile if it doesn't exist
            userProfile = {
              uid: user.uid,
              displayName: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              bannerURL: "gradient", // Default banner
              createdAt: Timestamp.now(),
              preferences: {
                darkMode: false,
                language: "en",
              },
              subscription: {
                level: "free",
                expiresAt: Timestamp.now(),
              },
            };
            await saveUserProfile(userProfile);
          }
          
          setProfile(userProfile);
          
          // Apply dark mode preference
          if (userProfile.preferences?.darkMode) {
            setTheme("dark");
          } else {
            setTheme("light");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user profile",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, toast, setTheme]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !profile) {
      console.error("Cannot update profile: user or profile is null");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot update profile: you must be logged in",
      });
      return;
    }

    try {
      // Create a properly structured update object
      const updatedProfile = { 
        ...profile,
        ...data,
        // Ensure nested objects are properly merged
        preferences: {
          ...(profile.preferences || { darkMode: false, language: "en" }),
          ...(data.preferences || {})
        },
        subscription: {
          ...(profile.subscription || { level: "free", expiresAt: Timestamp.now() }),
          ...(data.subscription || {})
        }
      };
      
      const savedProfile = await saveUserProfile(updatedProfile);
      setProfile(savedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  const toggleDarkMode = async () => {
    if (!user || !profile) {
      console.log("Cannot toggle dark mode: user or profile is null");
      return;
    }

    const currentDarkMode = profile.preferences?.darkMode ?? false;
    const newDarkMode = !currentDarkMode;
    
    try {
      // Set theme immediately for better UX
      setTheme(newDarkMode ? "dark" : "light");
      
      // Prepare update with safely constructed preferences object
      const updatedPreferences = {
        ...(profile.preferences || {}),
        darkMode: newDarkMode,
        language: profile.preferences?.language || "en"
      };
      
      await updateProfile({
        preferences: updatedPreferences
      });
    } catch (error) {
      console.error("Error toggling dark mode:", error);
      // Revert theme if update failed
      setTheme(currentDarkMode ? "dark" : "light");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme preference",
      });
    }
  };

  const upgradeSubscription = async () => {
    if (!user || !profile) return;

    try {
      // Calculate one year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      await updateProfile({
        subscription: {
          level: "premium",
          expiresAt: Timestamp.fromDate(expiryDate),
        },
      });
      
      toast({
        title: "Subscription upgraded",
        description: "You are now a premium member!",
      });
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upgrade subscription",
      });
    }
  };

  const updateBanner = async (bannerUrl: string) => {
    if (!user || !profile) {
      console.error("Cannot update banner: user or profile is null");
      return;
    }
    
    try {
      await updateProfile({
        bannerURL: bannerUrl
      });
      
      toast({
        title: "Banner updated",
        description: "Your profile banner has been updated successfully",
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

  const value = {
    profile,
    loading,
    updateProfile,
    toggleDarkMode,
    upgradeSubscription,
    updateBanner,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};