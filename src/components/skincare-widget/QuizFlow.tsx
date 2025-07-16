import { useState } from "react";

interface QuizFlowProps {
  onComplete: (answers: any) => void;
}

const skinConcerns = [
  {
    value: "acne",
    label: "Acne",
    image: "/acne q11.png"
  },
  {
    value: "dark-spots",
    label: "Dark Spots",
    image: "/darkspots.png"
  },
  {
    value: "tan",
    label: "Tan",
    image: "/tan.png"
  },
  {
    value: "aging",
    label: "Aging",
    image: "/aging1.png"
  }
];

const acneTypes = [
  { value: "large-pus", label: "Large pus filled" },
  { value: "red-painful", label: "Red, painful and swollen" },
  { value: "small-bumps", label: "Small painful bumps" },
  { value: "whiteheads-blackheads", label: "Many whiteheads/blackheads" }
];
const acneCount = [
  { value: "0-2", label: "0-2" },
  { value: "2-5", label: "2-5" },
  { value: "5+", label: "More than 5" }
];
const skinTypes = [
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "normal", label: "Normal" },
  { value: "sensitive", label: "Sensitive" }
];
const exercise = [
  { value: "regularly", label: "Regularly" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" }
];
const sleep = [
  { value: "sound", label: "Sound sleep" },
  { value: "moderate", label: "Moderate sleep" },
  { value: "disturbed", label: "Disturbed sleep" }
];
const environment = [
  { value: "clean", label: "Clean" },
  { value: "urban", label: "Urban" },
  { value: "industrial", label: "Industrial" }
];
const stress = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" }
];
const ageGroups = [
  { value: "12-18", label: "12-18" },
  { value: "19-25", label: "19-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "45+", label: "45+" }
];
const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
];

const steps = [
  "concern",
  "acneType",
  "acneCount",
  "skinType",
  "exercise",
  "sleep",
  "environment",
  "stress",
  "age",
  "gender"
];

export default function QuizFlow({ onComplete }: QuizFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  // Determine if we should show acne sub-questions
  const showAcneSub = answers.concern === "acne";
  const effectiveSteps = steps.filter(
    (s) =>
      s !== "acneType" && s !== "acneCount" || (showAcneSub || (s !== "acneType" && s !== "acneCount"))
  );
  // Insert acne sub-questions if needed
  let displaySteps = steps.slice();
  if (!showAcneSub) {
    displaySteps = displaySteps.filter((s) => s !== "acneType" && s !== "acneCount");
  }

  const current = displaySteps[step];
  const isLast = step === displaySteps.length - 1;

  const handleSelect = (field: string, value: string) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
      setTimeout(() => {
      if (isLast) {
        onComplete(newAnswers);
    } else {
        setStep(step + 1);
      }
      }, 300);
  };

  // Accent color
  const accent = '#FFB300';
  const selectedStyle = {
    borderColor: accent,
    backgroundColor: '#FFF8E1',
    color: '#222'
  };
  const headingStyle = {
    color: accent
  };

  return (
    <div className="p-4 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-center mb-2" style={headingStyle}>Personalize Your Skincare</h3>
      {current === "concern" && (
        <div>
          <div className="font-medium mb-2 text-center">Choose your skin concern</div>
          <div className="flex flex-wrap justify-center gap-4">
            {skinConcerns.map((c) => (
              <button
                key={c.value}
                className={`flex flex-col items-center border-2 rounded-lg p-3 w-28 h-32 transition-colors duration-200 focus:outline-none`}
                style={answers.concern === c.value ? selectedStyle : {}}
                onClick={() => handleSelect("concern", c.value)}
                onMouseOver={e => { if (!(answers.concern === c.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.concern === c.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <img src={c.image} alt={c.label} className="w-12 h-12 mb-2 object-contain" />
                <span className="font-medium mb-1">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "acneType" && (
        <div>
          <div className="font-medium mb-2 text-center">How would you describe your acne?</div>
          <div className="flex flex-col gap-2">
            {acneTypes.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.acneType === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("acneType", o.value)}
                onMouseOver={e => { if (!(answers.acneType === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.acneType === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "acneCount" && (
        <div>
          <div className="font-medium mb-2 text-center">How many active acne do you have?</div>
          <div className="flex flex-col gap-2">
            {acneCount.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.acneCount === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("acneCount", o.value)}
                onMouseOver={e => { if (!(answers.acneCount === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.acneCount === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "skinType" && (
        <div>
          <div className="font-medium mb-2 text-center">What's your skin type?</div>
          <div className="flex flex-wrap justify-center gap-4">
            {skinTypes.map((o) => (
              <button
                key={o.value}
                className={`w-28 h-16 border-2 rounded-lg flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none`}
                style={answers.skinType === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("skinType", o.value)}
                onMouseOver={e => { if (!(answers.skinType === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.skinType === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "exercise" && (
        <div>
          <div className="font-medium mb-2 text-center">How often do you exercise?</div>
          <div className="flex flex-col gap-2">
            {exercise.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.exercise === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("exercise", o.value)}
                onMouseOver={e => { if (!(answers.exercise === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.exercise === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "sleep" && (
        <div>
          <div className="font-medium mb-2 text-center">How are your sleeping patterns?</div>
          <div className="flex flex-col gap-2">
            {sleep.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.sleep === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("sleep", o.value)}
                onMouseOver={e => { if (!(answers.sleep === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.sleep === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "environment" && (
        <div>
          <div className="font-medium mb-2 text-center">How is your environment?</div>
          <div className="flex flex-col gap-2">
            {environment.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.environment === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("environment", o.value)}
                onMouseOver={e => { if (!(answers.environment === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.environment === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "stress" && (
        <div>
          <div className="font-medium mb-2 text-center">How is your stress levels?</div>
          <div className="flex flex-col gap-2">
            {stress.map((o) => (
              <button
                key={o.value}
                className={`w-full p-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none`}
                style={answers.stress === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("stress", o.value)}
                onMouseOver={e => { if (!(answers.stress === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.stress === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "age" && (
        <div>
          <div className="font-medium mb-2 text-center">Your age group?</div>
          <div className="flex flex-wrap justify-center gap-4">
            {ageGroups.map((o) => (
              <button
                key={o.value}
                className={`w-24 h-12 border-2 rounded-lg flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none`}
                style={answers.age === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("age", o.value)}
                onMouseOver={e => { if (!(answers.age === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.age === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {current === "gender" && (
        <div>
          <div className="font-medium mb-2 text-center">Your Gender?</div>
          <div className="flex flex-wrap justify-center gap-4">
            {genders.map((o) => (
          <button
                key={o.value}
                className={`w-24 h-12 border-2 rounded-lg flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none`}
                style={answers.gender === o.value ? selectedStyle : {}}
                onClick={() => handleSelect("gender", o.value)}
                onMouseOver={e => { if (!(answers.gender === o.value)) e.currentTarget.style.borderColor = accent; }}
                onMouseOut={e => { if (!(answers.gender === o.value)) e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
                {o.label}
          </button>
          ))}
      </div>
        </div>
      )}
      <div className="text-xs text-muted-foreground text-center">
        Question {step + 1} of {displaySteps.length}
      </div>
    </div>
  );
}