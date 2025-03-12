
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm font-medium text-foreground/80">
        Upload an image (optional)
      </div>
      
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        
        {!image ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground font-medium">
              Click to upload
            </span>
            <span className="text-xs text-muted-foreground/70 mt-1">
              JPG, PNG, GIF (max. 5MB)
            </span>
          </div>
        ) : (
          <div className="relative w-full rounded-lg overflow-hidden group animate-scale-in">
            <img 
              src={image} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleRemoveImage}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
