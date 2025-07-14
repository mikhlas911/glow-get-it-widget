import { useState, useMemo } from "react";
import { ChevronRight, Heart, Droplets, Moon, Apple, Shield, MapPin, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SkinAnalysis, QuizAnswers } from "./SkincareWidget";

interface QuizFlowProps {
  skinAnalysis: SkinAnalysis;
  onComplete: (answers: QuizAnswers) => void;
}

interface QuizQuestion {
  id: keyof QuizAnswers;
  question: string;
  icon: React.ReactNode;
  options: { value: string; label: string; description?: string }[];
}

const allQuestions: QuizQuestion[] = [
  {
    id: "diet",
    question: "How would you describe your diet?",
    icon: <Apple className="w-5 h-5" />,
    options: [
      { value: "healthy", label: "Balanced Diet", description: "Lots of fruits, vegetables, and water" },
      { value: "balanced", label: "Mixed Diet", description: "Balance of healthy and indulgent foods" },
      { value: "needs-improvement", label: "Needs Improvement", description: "Often processed foods, low water intake" }
    ]
  },
  {
    id: "water",
    question: "How much water do you drink daily?",
    icon: <Droplets className="w-5 h-5" />,
    options: [
      { value: "high", label: "More than 2L", description: "8+ glasses per day" },
      { value: "medium", label: "1-2L", description: "4-8 glasses per day" },
      { value: "low", label: "Less than 1L", description: "Fewer than 4 glasses" }
    ]
  },
  {
    id: "concern",
    question: "What's your main skin concern?",
    icon: <Heart className="w-5 h-5" />,
    options: [
      { value: "acne", label: "Acne & Breakouts", description: "Pimples, blackheads, blemishes" },
      { value: "dryness", label: "Dryness", description: "Tight, flaky, or rough skin" },
      { value: "aging", label: "Aging", description: "Fine lines, wrinkles, loss of elasticity" },
      { value: "sensitivity", label: "Sensitivity", description: "Redness, irritation, reactions" },
      { value: "dullness", label: "Dullness", description: "Lack of glow, uneven tone" }
    ]
  },
  {
    id: "sleep",
    question: "How's your sleep quality?",
    icon: <Moon className="w-5 h-5" />,
    options: [
      { value: "good", label: "Good Quality", description: "7-9 hours, wake up refreshed" },
      { value: "fair", label: "Fair Quality", description: "6-7 hours, sometimes tired" },
      { value: "poor", label: "Poor Quality", description: "Less than 6 hours, often tired" }
    ]
  },
  {
    id: "stressLevel",
    question: "How would you rate your stress level?",
    icon: <Brain className="w-5 h-5" />,
    options: [
      { value: "low", label: "Low Stress", description: "Generally calm and relaxed" },
      { value: "moderate", label: "Moderate Stress", description: "Some daily pressures" },
      { value: "high", label: "High Stress", description: "Often feeling overwhelmed" }
    ]
  },
  {
    id: "environment",
    question: "What's your daily environment like?",
    icon: <MapPin className="w-5 h-5" />,
    options: [
      { value: "clean", label: "Clean Environment", description: "Minimal pollution, good air quality" },
      { value: "moderate", label: "Urban Environment", description: "City living, some pollution" },
      { value: "harsh", label: "Harsh Environment", description: "High pollution, extreme weather" }
    ]
  },
  {
    id: "routine",
    question: "How consistent is your skincare routine?",
    icon: <Shield className="w-5 h-5" />,
    options: [
      { value: "consistent", label: "Very Consistent", description: "Daily morning and evening routine" },
      { value: "sometimes", label: "Sometimes", description: "Regular but occasionally skip" },
      { value: "minimal", label: "Minimal Routine", description: "Basic cleansing only" }
    ]
  }
];

export const QuizFlow = ({ skinAnalysis, onComplete }: QuizFlowProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  
  // Smart question filtering based on photo analysis
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(question => {
      // Skip concern questions for detected conditions
      if (question.id === "concern") {
        const hasStrongDetection = skinAnalysis.detectedConditions.some(
          condition => condition.confidence > 80 && condition.severity !== "mild"
        );
        
        // If we detected strong conditions, filter out those options
        if (hasStrongDetection) {
          const detectedTypes = skinAnalysis.detectedConditions
            .filter(c => c.confidence > 80)
            .map(c => c.type);
          
          const filteredOptions = question.options.filter(option => {
            if (option.value === "acne" && detectedTypes.includes("acne")) return false;
            if (option.value === "dryness" && detectedTypes.includes("dry")) return false;
            return true;
          });
          
          // If most options are filtered out, skip the question entirely
          if (filteredOptions.length <= 1) return false;
          
          // Return modified question with filtered options
          return { ...question, options: filteredOptions };
        }
      }
      
      return true;
    });
  }, [skinAnalysis]);
  
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Complete the quiz
      setTimeout(() => {
        onComplete(newAnswers as QuizAnswers);
      }, 500);
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Skin Analysis Result */}
      <Card className="p-3 md:p-4 bg-gradient-soft border-accent">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground capitalize text-sm md:text-base">
            {skinAnalysis.skinType} Skin Detected
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {skinAnalysis.confidence}% confidence
          </p>
          
          {/* Show detected conditions */}
          {skinAnalysis.detectedConditions.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Detected conditions:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {skinAnalysis.detectedConditions.map((condition, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground capitalize"
                  >
                    {condition.severity} {condition.type}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 justify-center">
            {skinAnalysis.characteristics.map((char, index) => (
              <span 
                key={index}
                className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Smart Skip Notice */}
      {skinAnalysis.detectedConditions.some(c => c.confidence > 80) && (
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            We've detected your skin concerns from the photo, so we'll focus on lifestyle factors
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-1.5 md:h-2" />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
            {currentQuestion.icon}
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground px-2">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Answer Options - Mobile Optimized */}
        <div className="space-y-2 md:space-y-3">
          {currentQuestion.options.map((option) => (
            <Card 
              key={option.value}
              className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-card transition-all group"
              onClick={() => handleAnswer(option.value)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base leading-relaxed">
                    {option.label}
                  </h4>
                  {option.description && (
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center px-4">
        <p className="text-xs text-muted-foreground">
          Your answers help us create the perfect skincare routine for you
        </p>
      </div>
    </div>
  );
};