import { useState, useRef } from "react";
import { Camera, Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkinAnalysis } from "./SkincareWidget";

interface PhotoCaptureProps {
  onComplete: (analysis: SkinAnalysis) => void;
}

export const PhotoCapture = ({ onComplete }: PhotoCaptureProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setIsUploading(false);
        setTimeout(() => analyzePhoto(), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const skinTypes = ["oily", "dry", "combination", "normal", "sensitive"];
      const randomType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
      
      const characteristics = {
        oily: ["visible pores", "shine in T-zone", "occasional breakouts"],
        dry: ["tight feeling", "flaky patches", "fine lines"],
        combination: ["oily T-zone", "dry cheeks", "varied texture"],
        normal: ["balanced moisture", "smooth texture", "minimal concerns"],
        sensitive: ["easily irritated", "redness", "reactive to products"]
      };

      const analysis: SkinAnalysis = {
        skinType: randomType,
        confidence: Math.floor(Math.random() * 20) + 80,
        characteristics: characteristics[randomType as keyof typeof characteristics]
      };

      setIsAnalyzing(false);
      setTimeout(() => onComplete(analysis), 1000);
    }, 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
          <Camera className="w-8 h-8 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Analyze Your Skin
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Upload a clear selfie and our AI will analyze your skin type to create 
          personalized recommendations. Your photo is processed securely and not stored.
        </p>
      </div>

      {!uploadedImage && !isUploading && (
        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8" onClick={triggerFileInput}>
          <div className="text-center space-y-4">
            <Upload className="mx-auto w-12 h-12 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Upload a photo</p>
              <p className="text-sm text-muted-foreground">
                Or click to browse files
              </p>
            </div>
          </div>
        </Card>
      )}

      {isUploading && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto w-12 h-12 animate-spin text-primary" />
            <p className="font-medium text-foreground">Uploading photo...</p>
          </div>
        </Card>
      )}

      {uploadedImage && (
        <Card className="overflow-hidden">
          <div className="aspect-square relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded selfie" 
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="mx-auto w-8 h-8 animate-spin text-white" />
                  <p className="text-white text-sm font-medium">
                    Analyzing your skin...
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {uploadedImage && !isAnalyzing && (
        <div className="text-center space-y-3">
          <CheckCircle className="mx-auto w-12 h-12 text-success" />
          <p className="font-medium text-success">Analysis complete!</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        capture="user"
      />

      <div className="space-y-2">
        <Button 
          onClick={triggerFileInput} 
          className="w-full" 
          size="lg"
          disabled={isUploading || isAnalyzing}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : uploadedImage ? (
            "Upload Another Photo"
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Take or Upload Photo
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          By uploading, you agree to our privacy policy. Photos are analyzed locally and not stored.
        </p>
      </div>
    </div>
  );
};