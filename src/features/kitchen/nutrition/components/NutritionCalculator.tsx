import { useState } from "react";
import type {
  ActivityLevel,
  Gender,
  NutritionFormData,
  NutritionGoal,
  NutritionResults,
} from "../types/nutritionProfile";

interface NutritionCalculatorProps {
  onCalculate: (formData: NutritionFormData, results: NutritionResults) => void;
  initialFormData?: NutritionFormData | null;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const goalAdjustments: Record<NutritionGoal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

const defaultFormData: NutritionFormData = {
  age: "",
  gender: "female",
  heightFeet: "",
  heightInches: "",
  weight: "",
  activityLevel: "moderate",
  goal: "maintain",
};

function NutritionCalculator({
  onCalculate,
  initialFormData,
}: NutritionCalculatorProps) {
  const [formData, setFormData] = useState<NutritionFormData>(
    initialFormData || defaultFormData
  );

  const [error, setError] = useState("");

  const updateField = (field: keyof NutritionFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const calculateNutrition = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const age = Number(formData.age);
    const heightFeet = Number(formData.heightFeet);
    const heightInches = Number(formData.heightInches || 0);
    const weight = Number(formData.weight);

    if (!age || !heightFeet || !weight) {
      setError("Please enter your age, height, and weight.");
      return;
    }

    const totalHeightInches = heightFeet * 12 + heightInches;
    const heightCm = totalHeightInches * 2.54;
    const weightKg = weight * 0.453592;

    const genderAdjustment = formData.gender === "female" ? -161 : 5;

    const bmr =
      10 * weightKg + 6.25 * heightCm - 5 * age + genderAdjustment;

    const maintenanceCalories =
      bmr * activityMultipliers[formData.activityLevel];

    const goalCalories = maintenanceCalories + goalAdjustments[formData.goal];

    const proteinGrams = weight * 0.8;
    const fatGrams = (goalCalories * 0.25) / 9;
    const carbsGrams = (goalCalories - proteinGrams * 4 - fatGrams * 9) / 4;

    onCalculate(formData, {
      bmr: Math.round(bmr),
      maintenanceCalories: Math.round(maintenanceCalories),
      goalCalories: Math.round(goalCalories),
      proteinGrams: Math.round(proteinGrams),
      carbsGrams: Math.round(carbsGrams),
      fatGrams: Math.round(fatGrams),
    });
  };

  return (
    <form onSubmit={calculateNutrition} className="nutrition-calculator-card">
      <h2>Nutrition &amp; Fitness Calculator</h2>

      <p>
        Estimate daily calories and macro targets based on your age, height,
        weight, activity level, and goal.
      </p>

      {error && <p className="error-message">{error}</p>}

      <div className="nutrition-form-grid">
        <label>
          Age
          <input
            type="number"
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
            min="1"
          />
        </label>

        <label>
          Gender
          <select
            value={formData.gender}
            onChange={(e) => updateField("gender", e.target.value as Gender)}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>

        <label>
          Height - Feet
          <input
            type="number"
            value={formData.heightFeet}
            onChange={(e) => updateField("heightFeet", e.target.value)}
            min="1"
          />
        </label>

        <label>
          Height - Inches
          <input
            type="number"
            value={formData.heightInches}
            onChange={(e) => updateField("heightInches", e.target.value)}
            min="0"
            max="11"
          />
        </label>

        <label>
          Weight - lbs
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            min="1"
          />
        </label>

        <label>
          Activity Level
          <select
            value={formData.activityLevel}
            onChange={(e) =>
              updateField("activityLevel", e.target.value as ActivityLevel)
            }
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly active</option>
            <option value="moderate">Moderately active</option>
            <option value="active">Very active</option>
            <option value="veryActive">Extra active</option>
          </select>
        </label>

        <label>
          Goal
          <select
            value={formData.goal}
            onChange={(e) => updateField("goal", e.target.value as NutritionGoal)}
          >
            <option value="lose">Lose weight</option>
            <option value="maintain">Maintain weight</option>
            <option value="gain">Gain weight</option>
          </select>
        </label>
      </div>

      <button type="submit" className="primary-link nutrition-calculate-button">
        Calculate Targets
      </button>
    </form>
  );
}

export default NutritionCalculator;