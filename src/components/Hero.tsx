
import { useState } from "react";
import { Search, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search query:", searchQuery);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center hero-gradient overflow-hidden px-4">
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/5 w-24 h-24 rounded-full bg-love-200/30 dark:bg-love-800/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-love-300/20 dark:bg-love-700/20 blur-3xl animate-float" style={{animationDelay: "1s"}} />
      <div className="absolute top-1/2 right-1/5 w-16 h-16 rounded-full bg-love-200/30 dark:bg-love-800/20 blur-3xl animate-float" style={{animationDelay: "2s"}} />
      
      <div className="max-w-4xl mx-auto text-center space-y-6 z-10 animate-slide-in">
        <div className="inline-block rounded-full bg-love-100 dark:bg-love-900/30 px-4 py-1 mb-4">
          <span className="text-sm font-medium text-love-800 dark:text-love-300 flex items-center">
            <Heart size={14} className="mr-1" />
            AI-Powered Compliment Generator
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight md:leading-tight">
          Create the <span className="gradient-text">Perfect Compliment</span> for Someone Special
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Craft personalized, heartfelt compliments tailored to your special someone with our advanced AI technology.
        </p>
        
        <form 
          onSubmit={handleSearch}
          className="flex items-center relative mt-8 max-w-xl w-full mx-auto"
        >
          <div className="relative w-full glass rounded-full overflow-hidden flex items-center transition-all shadow-glass animate-scale-in">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you love about them..."
              className="border-none bg-transparent px-6 py-6 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mr-2 rounded-full hover:bg-foreground/5"
                >
                  <ChevronDown size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                side="bottom" 
                align="end" 
                className="w-64 p-4 bg-background border border-border shadow-md animate-fade-in"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quick-style">Style</Label>
                    <select 
                      id="quick-style" 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="romantic">Romantic</option>
                      <option value="poetic">Poetic</option>
                      <option value="humorous">Humorous</option>
                      <option value="deep">Deep</option>
                      <option value="charming">Charming</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quick-tone">Tone & Mood</Label>
                    <select 
                      id="quick-tone" 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
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
                    className="w-full"
                    onClick={() => setIsPopoverOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              type="submit" 
              className="mr-1 rounded-full bg-gradient-love hover:opacity-90 transition-opacity"
            >
              <Search size={18} className="mr-1" />
              <span className="hidden md:inline">Generate</span>
            </Button>
          </div>
        </form>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-4">
          <span>Try:</span>
          {["smile", "kindness", "eyes", "laughter"].map((term) => (
            <button
              key={term}
              className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              onClick={() => setSearchQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Button 
          variant="ghost" 
          className="text-foreground/60 hover:text-foreground animate-bounce"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span>Explore Features</span>
          <ChevronDown size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
