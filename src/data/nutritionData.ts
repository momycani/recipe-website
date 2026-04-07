import type { Nutrition } from "../types/nutrition";

export const nutritionData: Record<string, Nutrition> = {
  egg: { calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  milk: { calories: 120, protein: 8, carbs: 12, fat: 5 },
  flour: { calories: 455, protein: 13, carbs: 95, fat: 1 },
  sugar: { calories: 387, protein: 0, carbs: 100, fat: 0 },
  butter: { calories: 102, protein: 0, carbs: 0, fat: 12 },
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  rice: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  oats: { calories: 150, protein: 5, carbs: 27, fat: 3 },
  "olive oil": { calories: 119, protein: 0, carbs: 0, fat: 14 },
};