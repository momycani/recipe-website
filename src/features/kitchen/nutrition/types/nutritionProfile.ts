export type Gender = "female" | "male";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

export type NutritionGoal = "lose" | "maintain" | "gain";

export interface NutritionFormData {
  age: string;
  gender: Gender;
  heightFeet: string;
  heightInches: string;
  weight: string;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
}

export interface NutritionResults {
  bmr: number;
  maintenanceCalories: number;
  goalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface SavedNutritionProfile {
  userId: string;
  formData: NutritionFormData;
  results: NutritionResults;
  createdAt?: Date;
  updatedAt?: Date;
}