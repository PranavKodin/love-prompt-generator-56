import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Gift, Sparkles, Star, Compass, DollarSign, CalendarHeart, Clock, Coffee, PenLine, Tag, Palette } from "lucide-react";
import { generateSurprises } from "@/lib/surpriseService";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Predefined surprise ideas for different categories
const predefinedSurprises = [
  {
    title: "Surprise Breakfast in Bed",
    description: "Wake up early and prepare a delicious breakfast with their favorite foods. Serve it to them in bed for a loving start to the day.",
    difficulty: "easy",
    estimatedCost: "$15-30",
    category: "romantic"
  },
  {
    title: "Memory Jar",
    description: "Fill a jar with handwritten notes of your favorite memories together. They can pull one out whenever they need a reminder of your love.",
    difficulty: "easy",
    estimatedCost: "$5-10",
    category: "thoughtful"
  },
  {
    title: "Star Gazing Picnic",
    description: "Pack a late-night picnic and drive to a spot with minimal light pollution. Bring a blanket, some wine, and stargazing app to identify constellations together.",
    difficulty: "medium",
    estimatedCost: "$30-50",
    category: "romantic"
  },
  {
    title: "Surprise Concert Tickets",
    description: "Get tickets to see their favorite band or artist. Make it even more special by keeping it a secret until the day of the show.",
    difficulty: "hard",
    estimatedCost: "$100-300",
    category: "experience"
  },
  {
    title: "DIY Spa Day",
    description: "Transform your home into a spa retreat with scented candles, relaxing music, and homemade face masks. Give them a massage to complete the experience.",
    difficulty: "medium",
    estimatedCost: "$20-40",
    category: "relaxation"
  },
  {
    title: "Love Letter Treasure Hunt",
    description: "Hide love notes around your home or city with clues leading to the next location. The final destination could be a special place for dinner or a meaningful gift.",
    difficulty: "medium",
    estimatedCost: "$10-100",
    category: "adventure"
  },
  {
    title: "Custom Playlist",
    description: "Create a playlist of songs that are meaningful to your relationship. Add a personal note explaining why each song was chosen.",
    difficulty: "easy",
    estimatedCost: "Free",
    category: "thoughtful"
  },
  {
    title: "Mystery Date Night",
    description: "Plan a complete date night where they don't know the agenda. Give them a dress code and pick them up as if it were a first date.",
    difficulty: "medium",
    estimatedCost: "$50-150",
    category: "adventure"
  },
  {
    title: "Cooking Class Together",
    description: "Book a cooking class to learn how to make a new cuisine together. It's a fun activity and results in a delicious meal you can enjoy.",
    difficulty: "medium",
    estimatedCost: "$60-120",
    category: "experience"
  },
  {
    title: "Handmade Coupon Book",
    description: "Create a book of coupons they can redeem for different favors, like a massage, breakfast in bed, or a night where they choose the movie.",
    difficulty: "easy",
    estimatedCost: "$5",
    category: "thoughtful"
  },
  {
    title: "Sunset Surprise Picnic",
    description: "Pack a basket with their favorite snacks and drinks and take them to a scenic spot to watch the sunset together.",
    difficulty: "easy",
    estimatedCost: "$30-50",
    category: "romantic"
  },
  {
    title: "Weekend Getaway",
    description: "Book a stay at a nearby bed and breakfast or unique Airbnb for a short but refreshing change of scenery.",
    difficulty: "hard",
    estimatedCost: "$200-500",
    category: "experience"
  }
];

// Different surprise categories with their icons
const categories = [
  { id: "all", label: "All Surprises", icon: <Sparkles className="mr-2 h-4 w-4" /> },
  { id: "romantic", label: "Romantic", icon: <Heart className="mr-2 h-4 w-4" /> },
  { id: "thoughtful", label: "Thoughtful", icon: <PenLine className="mr-2 h-4 w-4" /> },
  { id: "adventure", label: "Adventure", icon: <Compass className="mr-2 h-4 w-4" /> },
  { id: "experience", label: "Experience", icon: <Star className="mr-2 h-4 w-4" /> },
  { id: "relaxation", label: "Relaxation", icon: <Coffee className="mr-2 h-4 w-4" /> }
];

// Budget options
const budgetOptions = [
  { value: "low", label: "Low ($0-50)" },
  { value: "medium", label: "Medium ($50-150)" },
  { value: "high", label: "High ($150+)" }
];

// Occasion options
const occasionOptions = [
  { value: "anniversary", label: "Anniversary" },
  { value: "birthday", label: "Birthday" },
  { value: "valentine", label: "Valentine's Day" },
  { value: "just-because", label: "Just Because" },
  { value: "date-night", label: "Special Date Night" },
  { value: "holiday", label: "Holiday" }
];

// Difficulty indicator component
const DifficultyIndicator = ({ level }: { level: "easy" | "medium" | "hard" }) => {
  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 rounded-full mr-1 ${
        level === "easy" ? "bg-green-500" : 
        level === "medium" ? "bg-amber-500" : 
        "bg-red-500"
      }`} />
      <span className="text-xs capitalize">{level}</span>
    </div>
  );
};

const Surprises = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // For custom idea generation
  const [partnerInterests, setPartnerInterests] = useState("");
  const [occasion, setOccasion] = useState("anniversary");
  const [budget, setBudget] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  
  // Filter surprises based on category
  const filteredSurprises = activeCategory === "all" 
    ? predefinedSurprises 
    : predefinedSurprises.filter(surprise => surprise.category === activeCategory);
  
  const handleGenerateIdeas = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to generate custom surprise ideas",
        variant: "destructive"
      });
      navigate("/get-started");
      return;
    }
    
    if (!partnerInterests.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your partner's interests"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const budgetString = 
        budget === "low" ? "under $50" : 
        budget === "medium" ? "$50-150" : 
        "over $150";
      
      const ideas = await generateSurprises(
        partnerInterests,
        occasion,
        budgetString
      );
      
      setGeneratedIdeas(ideas);
      setActiveTab("custom");
      
      toast({
        title: "Success",
        description: "Custom surprise ideas generated successfully"
      });
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate surprise ideas"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Surprise Suggestions</h1>
        <p className="text-muted-foreground">
          Find creative ways to surprise your partner and keep the romance alive
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="browse">Browse Ideas</TabsTrigger>
          <TabsTrigger value="custom">Custom Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="pt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={cn(
                  "transition-all",
                  activeCategory === category.id && "bg-love-500 hover:bg-love-600"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurprises.map((surprise, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {surprise.category === "romantic" && <Heart className="h-4 w-4 mr-1 text-love-500" />}
                      {surprise.category === "thoughtful" && <PenLine className="h-4 w-4 mr-1 text-blue-500" />}
                      {surprise.category === "adventure" && <Compass className="h-4 w-4 mr-1 text-amber-500" />}
                      {surprise.category === "experience" && <Star className="h-4 w-4 mr-1 text-purple-500" />}
                      {surprise.category === "relaxation" && <Coffee className="h-4 w-4 mr-1 text-teal-500" />}
                      <CardTitle className="text-lg leading-tight">{surprise.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <DifficultyIndicator level={surprise.difficulty as "easy" | "medium" | "hard"} />
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-xs">{surprise.estimatedCost}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{surprise.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="capitalize">{surprise.category}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-love-200 dark:border-love-800 text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20"
                    onClick={() => {
                      navigator.clipboard.writeText(surprise.description);
                      toast({
                        title: "Copied",
                        description: "Surprise idea copied to clipboard",
                      });
                    }}
                  >
                    Save Idea
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-love-500" />
                    Generate Custom Ideas
                  </CardTitle>
                  <CardDescription>
                    Get personalized surprise suggestions based on your partner's interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interests">Partner's Interests</Label>
                      <Textarea 
                        id="interests"
                        value={partnerInterests}
                        onChange={(e) => setPartnerInterests(e.target.value)}
                        placeholder="Reading, hiking, cooking, jazz music, dogs..."
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select value={occasion} onValueChange={setOccasion}>
                        <SelectTrigger id="occasion">
                          <SelectValue placeholder="Select an occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger id="budget">
                          <SelectValue placeholder="Select a budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-love hover:opacity-90 transition-opacity"
                    onClick={handleGenerateIdeas}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Generate Surprise Ideas
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              {generatedIdeas.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-love-500" />
                    Your Custom Ideas
                  </h3>
                  
                  <div className="space-y-4">
                    {generatedIdeas.map((idea, index) => (
                      <Card key={index} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg leading-tight">{idea.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <DifficultyIndicator level={idea.difficulty as "easy" | "medium" | "hard"} />
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs">{idea.estimatedCost}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{idea.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Tag className="h-3 w-3 mr-1" />
                            <span className="capitalize">{idea.category}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-love-200 dark:border-love-800 text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20"
                            onClick={() => {
                              navigator.clipboard.writeText(idea.description);
                              toast({
                                title: "Copied",
                                description: "Surprise idea copied to clipboard",
                              });
                            }}
                          >
                            Save Idea
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 border border-dashed rounded-lg max-w-md">
                    <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No custom ideas yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Fill out the form and generate personalized surprise ideas based on your partner's interests.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Surprises;