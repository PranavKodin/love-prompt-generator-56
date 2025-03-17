import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Image, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BannerOption {
  id: string;
  url: string;
  type: "image" | "gradient";
}

export const defaultBanners: BannerOption[] = [
  {
    id: "gradient",
    url: "gradient",
    type: "gradient"
  },
  {
    id: "banner1",
    url: "https://i.pinimg.com/736x/f5/66/c4/f566c4ebdee5a4b70ce372ed3f60da36.jpg",
    type: "image"
  },
  {
    id: "banner2",
    url: "https://i.pinimg.com/736x/b2/2e/44/b22e44a5bef348ee307c5801b6176797.jpg",
    type: "image"
  },
  {
    id: "banner3",
    url: "https://i.pinimg.com/736x/60/01/63/6001631fd263df002fec2ac0be29155b.jpg",
    type: "image"
  },
  {
    id: "banner4",
    url: "https://i.pinimg.com/736x/ae/d0/40/aed0408855402b98978c962832e3e0b7.jpg",
    type: "image"
  },
  {
    id: "banner5",
    url: "https://i.pinimg.com/736x/d3/a6/12/d3a612cea4451cd0d92bd20af1333b8d.jpg",
    type: "image"
  },
  {
    id: "banner6",
    url: "https://i.pinimg.com/originals/7f/f9/a2/7ff9a27da311166cc40ccfd331d1c7e5.gif",
    type: "image"
  },
  {
    id: "banner7",
    url: "https://i.pinimg.com/originals/e5/4a/fa/e54afabd75adb33464e85f2687b43f87.gif",
    type: "image"
  },
  {
    id: "banner8",
    url: "https://i.pinimg.com/originals/1f/f0/a9/1ff0a97335c602f48ad7c08b8d3d0e88.gif",
    type: "image"
  },
  {
    id: "banner9",
    url: "https://i.pinimg.com/originals/28/db/7b/28db7ba7a159bb00e8aa610b7a854a9c.gif",
    type: "image"
  },
  {
    id: "banner10",
    url: "https://i.pinimg.com/originals/ab/32/b2/ab32b287d5bc96d3dafe9c3ae2311d76.gif",
    type: "image"
  },
  {
    id: "banner11",
    url: "https://i.pinimg.com/originals/aa/47/d3/aa47d37995cde50719e37e2ab0ee7cf2.gif",
    type: "image"
  }
];


export const colorOptions = [
  { id: "love-500", color: "#e11d48", gradient: "linear-gradient(to right, #e11d48, #fb7185)" },
  { id: "pink-500", color: "#ec4899", gradient: "linear-gradient(to right, #ec4899, #f472b6)" },
  { id: "purple-500", color: "#8b5cf6", gradient: "linear-gradient(to right, #8b5cf6, #a78bfa)" },
  { id: "blue-500", color: "#3b82f6", gradient: "linear-gradient(to right, #3b82f6, #60a5fa)" },
  { id: "green-500", color: "#22c55e", gradient: "linear-gradient(to right, #22c55e, #4ade80)" },
  { id: "yellow-500", color: "#eab308", gradient: "linear-gradient(to right, #eab308, #facc15)" },
  { id: "orange-500", color: "#f97316", gradient: "linear-gradient(to right, #f97316, #fb923c)" },
  { id: "teal-500", color: "#14b8a6", gradient: "linear-gradient(to right, #14b8a6, #2dd4bf)" },
];

interface BannerSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBanner: string;
  onSelect: (banner: string) => void;
}

export const BannerSelector = ({
  open,
  onOpenChange,
  currentBanner,
  onSelect
}: BannerSelectorProps) => {
  const [selectedBanner, setSelectedBanner] = useState<string>(currentBanner);
  const [activeTab, setActiveTab] = useState<"images" | "colors">("images");

  const handleConfirm = () => {
    onSelect(selectedBanner);
    onOpenChange(false);
  };

  const isColor = (banner: string) => {
    return colorOptions.some(color => color.id === banner || color.color === banner);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose a Profile Banner</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "images" | "colors")} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="images" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {defaultBanners.map((banner) => (
                <div 
                  key={banner.id}
                  className={`relative rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 border-2 ${
                    selectedBanner === banner.url 
                      ? "border-love-500 shadow-lg" 
                      : "border-transparent hover:border-love-300"
                  }`}
                  onClick={() => setSelectedBanner(banner.url)}
                >
                  {banner.url === "gradient" ? (
                    <div className="h-24 bg-gradient-love rounded-md" />
                  ) : (
                    <img 
                      src={banner.url} 
                      alt={`Banner option ${banner.id}`}
                      className="w-full h-24 object-cover" 
                    />
                  )}
                  
                  {selectedBanner === banner.url && (
                    <div className="absolute top-2 right-2 bg-love-500 rounded-full p-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {colorOptions.map((color) => (
                <div 
                  key={color.id}
                  className={`relative rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 border-2 ${
                    selectedBanner === color.id 
                      ? "border-love-500 shadow-lg" 
                      : "border-transparent hover:border-love-300"
                  }`}
                  onClick={() => setSelectedBanner(color.id)}
                >
                  <div 
                    className="h-24 rounded-md" 
                    style={{ background: color.gradient }}
                  />
                  
                  {selectedBanner === color.id && (
                    <div className="absolute top-2 right-2 bg-love-500 rounded-full p-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-love hover:bg-love-600 text-white" 
            onClick={handleConfirm}
          >
            Apply Banner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};