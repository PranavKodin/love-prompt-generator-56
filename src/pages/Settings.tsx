
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import { CreditCard, Lock, LogOut, Moon, Settings as SettingsIcon, Sun, User } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const { profile } = useUser();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user || !profile) {
    navigate("/get-started");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground hero-gradient">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text animate-text-shimmer">
            Settings
          </h1>

          <Tabs defaultValue="account" className="animate-fade-in">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="account" className="text-sm sm:text-base">
                <User className="mr-2 h-4 w-4 hidden sm:inline" />
                Account
              </TabsTrigger>
              <TabsTrigger value="appearance" className="text-sm sm:text-base">
                <Sun className="mr-2 h-4 w-4 hidden sm:inline" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="subscription" className="text-sm sm:text-base">
                <CreditCard className="mr-2 h-4 w-4 hidden sm:inline" />
                Subscription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-xl text-love-600 dark:text-love-400 flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <div className="p-2 rounded-md bg-secondary/50 dark:bg-secondary/30">{profile.displayName}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="p-2 rounded-md bg-secondary/50 dark:bg-secondary/30">{profile.email}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/profile")}
                        className="border-love-200 dark:border-love-800/50 text-love-600 dark:text-love-400 hover:bg-love-100/50 dark:hover:bg-love-900/30"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-xl text-love-600 dark:text-love-400 flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Security
                    </CardTitle>
                    <CardDescription>Manage your security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="w-full sm:w-auto"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl text-love-600 dark:text-love-400 flex items-center">
                    <SettingsIcon className="mr-2 h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize how loverprompt looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-base font-medium">Dark Mode</label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch 
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => {
                          setTheme(checked ? "dark" : "light");
                        }}
                      />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="space-y-0.5">
                      <label className="text-base font-medium">Use System Theme</label>
                      <p className="text-sm text-muted-foreground">Automatically match your system preferences</p>
                    </div>
                    <div>
                      <Switch 
                        checked={theme === "system"}
                        onCheckedChange={(checked) => {
                          setTheme(checked ? "system" : theme === "dark" ? "dark" : "light");
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl text-love-600 dark:text-love-400 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Subscription
                  </CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold capitalize">
                          {profile.subscription?.level || "Free"} Plan
                        </h3>
                        {profile.subscription?.level === "premium" ? (
                          <p className="text-sm text-muted-foreground">
                            Expires: {profile.subscription.expiresAt && 
                              new Date(profile.subscription.expiresAt.seconds * 1000).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Basic features</p>
                        )}
                      </div>
                      <div>
                        {profile.subscription?.level === "premium" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-love-100/50 dark:bg-love-900/30 text-love-600 dark:text-love-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            Limited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {profile.subscription?.level !== "premium" && (
                    <Card className="relative overflow-hidden border-love-200/50 dark:border-love-800/50 shadow-md">
                      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                        <div className="w-24 h-24 rounded-full bg-gradient-love opacity-30 blur-xl"></div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Upgrade to Premium</CardTitle>
                        <CardDescription>Get access to all features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold mb-4">₹99 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start">
                            <span className="h-5 w-5 text-love-600 dark:text-love-400 mr-2">✓</span>
                            <span>Unlimited saved compliments</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-5 w-5 text-love-600 dark:text-love-400 mr-2">✓</span>
                            <span>Advanced customization options</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-5 w-5 text-love-600 dark:text-love-400 mr-2">✓</span>
                            <span>Priority compliment generation</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-5 w-5 text-love-600 dark:text-love-400 mr-2">✓</span>
                            <span>Ad-free experience</span>
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-gradient-love hover:opacity-90 transition-all duration-300"
                          onClick={() => {
                            // Open subscription modal or process
                            document.getElementById("subscription-modal")?.classList.remove("hidden");
                          }}
                        >
                          Upgrade Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
