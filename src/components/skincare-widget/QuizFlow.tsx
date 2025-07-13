import { useState } from "react";
import { ChevronRight, Heart, Droplets, Moon, Apple } from "lucide-react";
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

const questions: QuizQuestion[] = [
  {
    id: "diet",
    question: "How would you describe your diet?",
    icon: <Apple className="w-5 h-5" />,
    options: [
      { value: "healthy", label: "Healthy", description: "Lots of fruits, vegetables, and water" },
      { value: "balanced", label: "Balanced", description: "Mix of healthy and indulgent foods" },
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
      { value: "good", label: "Good", description: "7-9 hours, wake up refreshed" },
      { value: "fair", label: "Fair", description: "6-7 hours, sometimes tired" },
      { value: "poor", label: "Poor", description: "Less than 6 hours, often tired" }
    ]
  }
];

export const QuizFlow = ({ skinAnalysis, onComplete }: QuizFlowProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
    <div className="p-6 space-y-6">
      {/* Skin Analysis Result */}
      <Card className="p-4 bg-gradient-soft border-accent">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground capitalize">
            {skinAnalysis.skinType} Skin Detected
          </h3>
          <p className="text-sm text-muted-foreground">
            {skinAnalysis.confidence}% confidence
          </p>
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

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
            {currentQuestion.icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <Card 
              key={option.value}
              className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-card transition-all group"
              onClick={() => handleAnswer(option.value)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {option.label}
                  </h4>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your answers help us create the perfect skincare routine for you
        </p>
      </div>
    </div>
  );
};