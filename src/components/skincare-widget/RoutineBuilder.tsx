import { useState, useEffect } from "react";

const STEPS = [
  { id: "cleanser", label: "Cleanser" },
  { id: "serum", label: "Serum" },
  { id: "moisturizer", label: "Moisturizer" },
  { id: "spf", label: "SPF" }
];

const PRODUCTS = [
  { id: "1", name: "Gentle Cleanser", step: "cleanser" },
  { id: "2", name: "Hydrating Serum", step: "serum" },
  { id: "3", name: "Daily Moisturizer", step: "moisturizer" },
  { id: "4", name: "Sun Shield SPF 30", step: "spf" }
];

export default function RoutineBuilder({ onBack }: { onBack?: () => void }) {
  const [routine, setRoutine] = useState(() =>
    JSON.parse(localStorage.getItem("routine") || "{}")
  );
  const [reminderTimes, setReminderTimes] = useState(() =>
    JSON.parse(localStorage.getItem("reminderTimes") || '{"am":"08:00","pm":"20:00"}')
  );

  useEffect(() => {
    localStorage.setItem("routine", JSON.stringify(routine));
    localStorage.setItem("reminderTimes", JSON.stringify(reminderTimes));
  }, [routine, reminderTimes]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    const checkReminders = setInterval(() => {
      const now = new Date();
      const current = now.toTimeString().slice(0,5);
      if (current === reminderTimes.am) {
        new Notification("Time for your AM skincare routine!");
      }
      if (current === reminderTimes.pm) {
        new Notification("Time for your PM skincare routine!");
      }
    }, 60000);
    return () => clearInterval(checkReminders);
  }, [reminderTimes]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Build Your Routine</h2>
      {STEPS.map(step => (
        <div key={step.id} className="mb-2">
          <label className="block font-medium">{step.label}</label>
          <select
            className="w-full border rounded p-2"
            value={routine[step.id] || ""}
            onChange={e => setRoutine({ ...routine, [step.id]: e.target.value })}
          >
            <option value="">Select a product</option>
            {PRODUCTS.filter(p => p.step === step.id).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      ))}
      <div>
        <label className="block font-medium">AM Reminder Time</label>
        <input
          type="time"
          className="border rounded p-2"
          value={reminderTimes.am}
          onChange={e => setReminderTimes({ ...reminderTimes, am: e.target.value })}
        />
      </div>
      <div>
        <label className="block font-medium">PM Reminder Time</label>
        <input
          type="time"
          className="border rounded p-2"
          value={reminderTimes.pm}
          onChange={e => setReminderTimes({ ...reminderTimes, pm: e.target.value })}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Your routine and reminders are saved on this device.
      </p>
      {onBack && (
        <button className="mt-4 px-4 py-2 bg-primary text-white rounded" onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
}