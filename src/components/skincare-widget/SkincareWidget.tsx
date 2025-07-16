import { useState, useEffect } from "react";
import { Camera, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhotoCapture } from "./PhotoCapture";
import QuizFlow from "./QuizFlow";
import { Recommendations } from "./Recommendations";
import { Progress } from "@/components/ui/progress";
import RoutineBuilder from "./RoutineBuilder";

export type WidgetStep = "trigger" | "quiz" | "recommendations" | "routine";

export interface DetectedCondition {
  type: "acne" | "oily" | "dry" | "sensitive" | "aging";
  severity: "mild" | "moderate" | "severe";
  confidence: number;
  areas: string[];
}

export interface QuizAnswers {
  diet: string;
  water: string;
  concern: string;
  sleep: string;
  environment?: string;
  stressLevel?: string;
  routine?: string;
}

export interface SkinAnalysis {
  skinType: string;
  confidence: number;
  characteristics: string[];
  detectedConditions: DetectedCondition[];
  skipQuestions: string[];
}

const SkincareWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<WidgetStep>("trigger");
  const [showIntroText, setShowIntroText] = useState(true);
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    diet: "",
    water: "",
    concern: "",
    sleep: "",
    environment: "",
    stressLevel: "",
    routine: ""
  });
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Hide intro text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroText(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const getStepProgress = () => {
    switch (currentStep) {
      case "trigger":
        return 0;
      case "quiz":
        return 50;
      case "recommendations":
        return 100;
      default:
        return 0;
    }
  };

  const handleWidgetOpen = () => {
    setIsOpen(true);
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setCurrentStep("recommendations");
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setCurrentStep("routine");
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("trigger");
    setSkinAnalysis(null);
    setQuizAnswers({
      diet: "",
      water: "",
      concern: "",
      sleep: "",
      environment: "",
      stressLevel: "",
      routine: ""
    });
    setSelectedPackage(null);
  };

  const renderContent = () => {
    switch (currentStep) {
      case "quiz":
        return (
          <QuizFlow
            onComplete={handleQuizComplete}
          />
        );
      case "recommendations":
        return (
          <Recommendations 
            quizAnswers={quizAnswers} 
            onClose={handleClose}
          />
        );
      case "routine":
        return <RoutineBuilder onBack={() => setCurrentStep("recommendations")} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Widget Trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="bg-white text-black font-semibold px-4 py-2 rounded-lg shadow text-base mb-1 border border-gray-200" style={{letterSpacing: '0.01em'}}>See What Your Skin Needs!</span>
          </div>
          {showIntroText && (
            <div className="animate-slide-up bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-widget text-sm font-medium whitespace-nowrap">
              Get your personalized skincare
            </div>
          )}
          <Button
            onClick={handleWidgetOpen}
            size="lg"
            className="w-16 h-16 rounded-full bg-black hover:bg-neutral-900 shadow-widget animate-bounce-in group relative overflow-hidden"
          >
            <Sparkles className="w-6 h-6" style={{ color: '#FFB300' }} />
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </Button>
        </div>
      )}

      {/* Widget Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Widget Content */}
          <Card className="relative w-full max-w-md max-h-[90vh] md:max-h-[80vh] bg-background shadow-widget animate-slide-up overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b bg-gradient-soft">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">
                  AI Skincare Companion
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {currentStep !== "trigger" && (
                <div className="space-y-2">
                  <Progress value={getStepProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Step {currentStep === "quiz" ? "1" : "2"} of 2
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {renderContent()}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SkincareWidget;