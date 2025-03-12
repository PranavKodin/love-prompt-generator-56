
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const complimentStyles = [
  { value: "romantic", label: "Romantic" },
  { value: "poetic", label: "Poetic" },
  { value: "humorous", label: "Humorous" },
  { value: "deep", label: "Deep" },
  { value: "charming", label: "Charming" },
];

const toneMoods = [
  { value: "flirty", label: "Flirty" },
  { value: "sincere", label: "Sincere" },
  { value: "funny", label: "Funny" },
  { value: "poetic", label: "Poetic" },
  { value: "shakespearean", label: "Shakespearean" },
];

export function CustomizationForm() {
  const [style, setStyle] = useState("romantic");
  const [tone, setTone] = useState("sincere");
  const [length, setLength] = useState([50]);
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="style">Compliment Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger id="style" className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              {complimentStyles.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tone">Tone & Mood</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              {toneMoods.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="length">Compliment Length</Label>
          <span className="text-sm text-muted-foreground">{length[0]}%</span>
        </div>
        <Slider
          id="length"
          min={10}
          max={100}
          step={10}
          value={length}
          onValueChange={setLength}
          className="py-2"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (Optional)</Label>
        <Textarea
          id="keywords"
          placeholder="Enter keywords, e.g., smile, eyes, kindness..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>
      
      <ImageUpload />
      
      <Button 
        className="w-full bg-gradient-love hover:opacity-90 transition-opacity button-glow"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isGenerating ? "Crafting Your Prompt..." : "Generate Compliment Prompt"}
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        Your prompt will be sent to our AI service. No compliments are generated on this page.
      </div>
    </div>
  );
}
