import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Heart, Sparkles, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const phrases = [
  "AI-Powered Compliment Generator",
  "Express Your Love Beautifully",
  "Create Perfect Words for Someone Special",
  "Let AI Help You Show Your Feelings",
  "Craft the Perfect Message of Affection"
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [phraseFade, setPhraseFade] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search query:", searchQuery);
    console.log("Image:", image);
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

  return (
    <div className="relative w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center hero-gradient overflow-hidden px-4 mt-8">
      {/* Floating elements with more pronounced animations */}
      <div className="absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-love-200/40 dark:bg-love-800/30 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-love-300/30 dark:bg-love-700/30 blur-3xl animate-float" style={{animationDelay: "1s"}} />
      <div className="absolute top-1/2 right-1/5 w-24 h-24 rounded-full bg-love-200/40 dark:bg-love-800/30 blur-3xl animate-float" style={{animationDelay: "2s"}} />
      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 rounded-full bg-love-400/20 dark:bg-love-600/20 blur-3xl animate-float" style={{animationDelay: "3s"}} />
      
      <div className="max-w-4xl mx-auto text-center space-y-6 z-10 animate-slide-in">
        <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4 overflow-hidden group">
          <span className={cn(
            "text-sm font-medium text-love-800 dark:text-love-300 flex items-center transition-opacity duration-500",
            phraseFade ? "opacity-0" : "opacity-100"
          )}>
            <Heart size={14} className="mr-1 animate-pulse-slow" />
            <span>{currentPhrase}</span>
            <Sparkles size={14} className="ml-1 animate-pulse-slow" style={{animationDelay: "1s"}} />
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight md:leading-tight">
          Create the <span className="gradient-text animate-pulse-slow font-great-vibes">Perfect Compliment</span> for Someone Special
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Craft personalized, heartfelt compliments tailored to your special someone with our advanced AI technology.
        </p>
        
        <form 
          onSubmit={handleSearch}
          className="flex items-center relative mt-8 max-w-xl w-full mx-auto"
        >
          <div className={cn(
            "relative w-full glass rounded-full overflow-hidden flex items-center transition-all duration-500 shadow-glass animate-scale-in",
            searchFocused ? "ring-2 ring-love-400 dark:ring-love-600 scale-105 search-glow" : ""
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
              className="border-none bg-transparent pl-12 pr-6 py-6 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="w-64 p-2 bg-white/80 dark:bg-midnight-800/80 backdrop-blur-lg border border-border rounded-xl shadow-xl animate-fade-in"
              >
                <div className="space-y-4">
                  <div className="space-y-2 px-2">
                    <Label htmlFor="quick-style" className="text-sm font-medium text-muted-foreground">Style</Label>
                    <select 
                      id="quick-style" 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-love-400 dark:focus:ring-love-600 transition-all duration-300"
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
            >
              <Search size={18} className="mr-1" />
              <span className="hidden md:inline">Generate</span>
            </Button>
          </div>
        </form>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
          <span>Try:</span>
          {["smile", "kindness", "eyes", "laughter", "intelligence", "caring"].map((term) => (
            <button
              key={term}
              className="px-3 py-1 rounded-full bg-muted hover:bg-love-100 dark:hover:bg-love-900/30 transition-all duration-300 hover:scale-105 hover:text-love-700 dark:hover:text-love-300"
              onClick={() => setSearchQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button 
          variant="ghost" 
          className="text-foreground/60 hover:text-foreground transition-all duration-300 hover:bg-transparent"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span>Explore Features</span>
          <ChevronDown size={16} className="ml-1 animate-pulse-slow" />
        </Button>
      </div>
    </div>
  );
}
