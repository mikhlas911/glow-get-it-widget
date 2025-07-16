import { useState, useRef } from "react";
import { Camera, Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkinAnalysis, DetectedCondition } from "./SkincareWidget";

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
    setTimeout(() => {
      let skinType = "normal";
      let hash = 0;
      if (uploadedImage) {
        for (let i = 0; i < uploadedImage.length; i++) {
          hash = uploadedImage.charCodeAt(i) + ((hash << 5) - hash);
        }
        const types = ["oily", "dry", "combination", "normal", "sensitive"];
        skinType = types[Math.abs(hash) % types.length];
      }
      const characteristics = {
        oily: ["enlarged pores", "T-zone shine", "blackheads visible"],
        dry: ["tight feeling", "flaky patches", "fine lines from dehydration"],
        combination: ["oily T-zone", "dry cheeks", "mixed texture"],
        normal: ["balanced moisture", "smooth texture", "even tone"],
        sensitive: ["mild redness", "reactive skin", "delicate appearance"]
      };
      const detectedConditions = [];
      const skipQuestions = [];

      // Oily
      if (skinType === "oily") {
        detectedConditions.push({
          type: "oily",
          severity: hash % 2 === 0 ? "moderate" : "severe",
          confidence: 90,
          areas: ["T-zone", "nose", "forehead"]
        });
        if (hash % 3 !== 0) {
          detectedConditions.push({
            type: "acne",
            severity: hash % 4 === 0 ? "severe" : "moderate",
            confidence: 85,
            areas: ["forehead", "chin"]
          });
        }
      }
      // Dry
      else if (skinType === "dry") {
        detectedConditions.push({
          type: "dry",
          severity: hash % 2 === 0 ? "moderate" : "severe",
          confidence: 90,
          areas: ["cheeks", "around eyes"]
        });
        if (hash % 5 === 0) {
          detectedConditions.push({
            type: "acne",
            severity: "mild",
            confidence: 70,
            areas: ["chin"]
          });
        }
        if (hash % 7 === 0) {
          detectedConditions.push({
            type: "sensitive",
            severity: "moderate",
            confidence: 80,
            areas: ["cheeks", "around nose"]
          });
        }
      }
      // Combination
      else if (skinType === "combination") {
        detectedConditions.push({
          type: "oily",
          severity: "mild",
          confidence: 70,
          areas: ["T-zone"]
        });
        detectedConditions.push({
          type: "dry",
          severity: "mild",
          confidence: 70,
          areas: ["cheeks"]
        });
        if (hash % 4 === 0) {
          detectedConditions.push({
            type: "acne",
            severity: "moderate",
            confidence: 75,
            areas: ["forehead", "chin"]
          });
        }
      }
      // Sensitive
      else if (skinType === "sensitive") {
        detectedConditions.push({
          type: "sensitive",
          severity: hash % 2 === 0 ? "moderate" : "severe",
          confidence: 90,
          areas: ["cheeks", "around nose"]
        });
        if (hash % 5 === 0) {
          detectedConditions.push({
            type: "dry",
            severity: "mild",
            confidence: 70,
            areas: ["cheeks"]
          });
        }
      }
      // Normal
      else {
        if (hash % 6 === 0) {
          detectedConditions.push({
            type: "acne",
            severity: "mild",
            confidence: 70,
            areas: ["forehead"]
          });
        }
        if (hash % 7 === 0) {
          detectedConditions.push({
            type: "sensitive",
            severity: "mild",
            confidence: 70,
            areas: ["cheeks"]
          });
        }
        if (hash % 8 === 0) {
          detectedConditions.push({
            type: "aging",
            severity: "mild",
            confidence: 65,
            areas: ["around eyes", "forehead"]
          });
        }
      }

      // Always at least one condition for demo
      if (detectedConditions.length === 0) {
        detectedConditions.push({
          type: skinType,
          severity: "mild",
          confidence: 60,
          areas: ["face"]
        });
      }

      const analysis = {
        skinType,
        confidence: 90,
        characteristics: characteristics[skinType],
        detectedConditions,
        skipQuestions
      };
      setIsAnalyzing(false);
      setTimeout(() => onComplete(analysis), 1000);
    }, 2000);
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