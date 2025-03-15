
import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Heart, Sparkles, Image, X, BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { saveCompliment, Compliment, Timestamp } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const phrases = [
  "AI-Powered Compliment Generator",
  "Express Your Love Beautifully",
  "Create Perfect Words for Someone Special",
  "Let AI Help You Show Your Feelings",
  "Craft the Perfect Message of Affection"
];

// Different animation classes for different screen sizes
const getAnimationClass = (baseClass: string, type: 'sm' | 'md' | 'lg' | 'xl') => {
  const screenClasses = {
    sm: "animate-slide-in-mobile",
    md: "animate-fade-in-tablet",
    lg: "animate-scale-in-desktop",
    xl: "animate-blur-in-tv"
  };
  return `${baseClass} ${screenClasses[type]}`;
};

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [phraseFade, setPhraseFade] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [complimentGenerated, setComplimentGenerated] = useState(false);
  const [compliment, setCompliment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Added new state for compliment parameters
  const [selectedStyle, setSelectedStyle] = useState("romantic");
  const [selectedTone, setSelectedTone] = useState("flirty");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseFade(true);
      setTimeout(() => {
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setPhraseFade(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!searchQuery) {
      setError("Please tell us what you like about the person!");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsSaved(false);

    // Generate compliment using OpenAI API
    try {
      // Create prompt using the search query and selected options
      const prompt = `Generate a ${selectedStyle}, ${selectedTone} compliment based on the following description of the person: "${searchQuery}". Be creative and ensure the compliment fits the style and tone specified.`;

      // Call OpenAI API
      const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a creative and thoughtful compliment generator." },
            { role: "user", content: prompt }
          ],
          max_tokens: 100
        })
      });

      if (!gptResponse.ok) {
        const gptErrorDetail = await gptResponse.text();
        console.error("GPT API Error:", gptErrorDetail);
        setError(`Error with API: ${gptErrorDetail}`);
        setIsLoading(false);
        return;
      }

      const gptData = await gptResponse.json();
      const generatedCompliment = gptData.choices[0].message.content.trim();

      // Set the compliment and update UI
      setCompliment(generatedCompliment);
      setComplimentGenerated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during API call:", error);
      setError("Error connecting to the API. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSaveCompliment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save compliments",
        variant: "destructive"
      });
      navigate("/get-started");
      return;
    }

    if (isSaved) return;

    setIsSaving(true);
    try {
      const complimentData: Omit<Compliment, 'id'> = {
        userId: user.uid,
        content: compliment,
        tone: selectedStyle,
        mood: selectedTone,
        recipient: "",
        createdAt: Timestamp.now(),
        isSaved: true
      };

      await saveCompliment(complimentData);
      setIsSaved(true);
      
      toast({
        title: "Compliment Saved",
        description: "Your compliment has been saved to your collection",
      });
    } catch (error) {
      console.error("Error saving compliment:", error);
      toast({
        title: "Error",
        description: "Failed to save compliment",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setComplimentGenerated(false);
    setCompliment("");
    setIsSaved(false);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Enhanced background with multiple animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-love-50/40 via-background to-love-100/20 dark:from-midnight-900/60 dark:via-background dark:to-love-900/10 z-0"></div>
      <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSJjdXJyZW50Q29sb3IiIGN4PSIxMCIgY3k9IjEwIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-30 z-0"></div>

      {/* Floating elements with enhanced animations */}
      <div className="absolute top-1/5 left-1/4 w-64 h-64 rounded-full bg-love-200/30 dark:bg-love-800/20 blur-3xl animate-float opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float opacity-60" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-love-100/30 dark:bg-love-900/20 blur-3xl animate-float opacity-50" style={{ animationDelay: "3s" }}></div>
      <div className="absolute bottom-1/3 left-1/5 w-56 h-56 rounded-full bg-love-400/10 dark:bg-love-600/10 blur-3xl animate-float opacity-60" style={{ animationDelay: "4s" }}></div>

      {/* Hearts floating animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-love-400/20 dark:text-love-600/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❤
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 z-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className={getAnimationClass("inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-5 py-1.5 mb-4 overflow-hidden group", "sm")}>
          <span className={cn(
            "text-sm font-medium text-love-800 dark:text-love-300 flex items-center transition-opacity duration-500",
            phraseFade ? "opacity-0" : "opacity-100"
          )}>
            <Heart size={14} className="mr-1.5 animate-pulse-slow" />
            <span>{currentPhrase}</span>
            <Sparkles size={14} className="ml-1.5 animate-pulse-slow" style={{ animationDelay: "1s" }} />
          </span>
        </div>

        <h1 className={getAnimationClass("text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight mb-6 animate-text-shimmer", "md")}>
          Create the <span className="font-great-vibes text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-text animate-pulse-slow">Perfect Compliment</span>
          <br className="md:hidden" /> for Someone Special
        </h1>

        <p className={getAnimationClass("text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-4 animate-fade-in", "lg")}>
          Craft personalized, heartfelt compliments tailored to your special someone with our advanced AI technology.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center relative mt-10 max-w-xl w-full mx-auto"
        >
          <div className={cn(
            getAnimationClass("relative w-full glass rounded-full overflow-hidden flex items-center transition-all duration-500 shadow-glass", "xl"),
            searchFocused ? "ring-4 ring-love-400/50 dark:ring-love-600/50 scale-105 search-glow" : ""
          )}>
            <div className="absolute left-5 text-foreground/50">
              <Search size={20} className={cn(
                "transition-all duration-300",
                searchFocused ? "text-love-600 dark:text-love-400" : "text-foreground/50"
              )} />
            </div>

            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="What do you love about them..."
              className="border-none bg-transparent pl-12 pr-6 py-6 text-base sm:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleImageClick}
              className="ml-auto mr-2 rounded-full relative hover:bg-foreground/10 transition-all duration-300"
            >
              {image ? (
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={handleRemoveImage}
                  >
                    <X size={14} className="text-white" />
                  </div>
                </div>
              ) : (
                <Image size={20} className="text-foreground/60 hover:text-love-600 dark:hover:text-love-400 transition-colors" />
              )}
            </Button>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mr-2 rounded-full hover:bg-foreground/10 transition-all duration-300"
                >
                  <ChevronDown size={20} className={cn(
                    "transition-transform duration-300",
                    isPopoverOpen ? "rotate-180" : ""
                  )} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                className="w-64 p-3 bg-white/90 dark:bg-midnight-800/90 backdrop-blur-lg border border-border rounded-xl shadow-xl animate-fade-in"
              >
                <div className="space-y-4">
                  <div className="space-y-2 px-2">
                    <Label htmlFor="quick-style" className="text-sm font-medium text-muted-foreground">Style</Label>
                    <select
                      id="quick-style"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-love-400 dark:focus:ring-love-600 transition-all duration-300"
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                    >
                      <option value="romantic">Romantic</option>
                      <option value="poetic">Poetic</option>
                      <option value="humorous">Humorous</option>
                      <option value="deep">Deep</option>
                      <option value="charming">Charming</option>
                    </select>
                  </div>

                  <div className="space-y-2 px-2">
                    <Label htmlFor="quick-tone" className="text-sm font-medium text-muted-foreground">Tone & Mood</Label>
                    <select
                      id="quick-tone"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-love-400 dark:focus:ring-love-600 transition-all duration-300"
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                    >
                      <option value="flirty">Flirty</option>
                      <option value="sincere">Sincere</option>
                      <option value="funny">Funny</option>
                      <option value="poetic">Poetic</option>
                      <option value="shakespearean">Shakespearean</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-love-100/50 dark:bg-love-900/30 hover:bg-love-200/50 dark:hover:bg-love-800/30 border-love-200 dark:border-love-800 text-love-800 dark:text-love-300 transition-all duration-300"
                    onClick={() => setIsPopoverOpen(false)}
                  >
                    <Sparkles size={16} className="mr-1 animate-pulse" />
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="submit"
              className="mr-1 rounded-full bg-gradient-love hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-love-500/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="hidden md:inline">Generating...</span>
                </div>
              ) : (
                <>
                  <Search size={18} className="mr-1" />
                  <span className="hidden md:inline">Generate</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 mt-2 text-sm bg-red-100 dark:bg-red-900/20 py-2 px-4 rounded-lg">
            {error}
          </div>
        )}

        {complimentGenerated && (
          <div className={getAnimationClass("mt-8 p-6 glass rounded-2xl max-w-2xl mx-auto border border-white/20 dark:border-white/10", "lg")}>
            <h3 className="text-xl md:text-2xl font-great-vibes text-love-600 dark:text-love-400 mb-3 animate-text-shimmer">Your Compliment</h3>
            <div className="text-foreground/80 p-4 bg-white/20 dark:bg-midnight-900/30 rounded-xl mb-4 italic">
              "{compliment}"
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Based on: <span className="text-foreground/80">{searchQuery}</span></p>
              <p>Style: <span className="text-foreground/80">{selectedStyle}</span> • Tone: <span className="text-foreground/80">{selectedTone}</span></p>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                className="border-love-300 dark:border-love-700 text-love-600 dark:text-love-400 hover:bg-love-50 dark:hover:bg-love-900/20"
                onClick={resetForm}
              >
                <Heart className="mr-2 animate-pulse" size={16} />
                Create New Compliment
              </Button>
              <Button
                variant="secondary"
                className="bg-love-100/50 dark:bg-love-900/20 hover:bg-love-200/50 dark:hover:bg-love-800/20"
                onClick={() => {
                  navigator.clipboard.writeText(compliment);
                  toast({
                    title: "Copied",
                    description: "Compliment copied to clipboard",
                  });
                }}
              >
                <Sparkles size={16} className="mr-2" />
                Copy
              </Button>
              <Button
                variant="default"
                className={cn(
                  "bg-gradient-love hover:opacity-90 transition-all duration-300",
                  isSaved && "bg-green-500 hover:bg-green-600"
                )}
                onClick={handleSaveCompliment}
                disabled={isSaving || isSaved}
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : isSaved ? (
                  <Check size={16} className="mr-2" />
                ) : (
                  <BookmarkPlus size={16} className="mr-2" />
                )}
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
          <span>Try:</span>
          {["smile", "kindness", "eyes", "laughter", "intelligence", "caring"].map((term, i) => (
            <button
              key={term}
              className={getAnimationClass("px-3 py-1 rounded-full bg-muted hover:bg-love-100 dark:hover:bg-love-900/30 transition-all duration-300 hover:scale-105 hover:text-love-700 dark:hover:text-love-300", "sm")}
              onClick={() => setSearchQuery(term)}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <Button
          variant="ghost"
          className="text-foreground/60 hover:text-foreground transition-all duration-300 hover:bg-transparent flex flex-col items-center animate-bounce"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="mb-1 text-center">Explore Features</span>
          <ChevronDown size={16} />
        </Button>
      </div>
    </div>
  );
}
