
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Image } from "lucide-react";

interface BannerOption {
  id: string;
  url: string;
}

export const defaultBanners: BannerOption[] = [
  {
    id: "gradient",
    url: "gradient"
  },
  {
    id: "banner1",
    url: "https://i.pinimg.com/736x/f5/66/c4/f566c4ebdee5a4b70ce372ed3f60da36.jpg"
  },
  {
    id: "banner2",
    url: "https://i.pinimg.com/736x/b2/2e/44/b22e44a5bef348ee307c5801b6176797.jpg"
  },
  {
    id: "banner3",
    url: "https://i.pinimg.com/736x/60/01/63/6001631fd263df002fec2ac0be29155b.jpg"
  },
  {
    id: "banner4",
    url: "https://i.pinimg.com/736x/ae/d0/40/aed0408855402b98978c962832e3e0b7.jpg"
  }
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

  const handleConfirm = () => {
    onSelect(selectedBanner);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose a Profile Banner</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
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
