import type { Nutrition } from "../types/nutrition";

export const nutritionData: Record<string, Nutrition> = {
  // Proteins
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 4 },
  beef: { calories: 250, protein: 26, carbs: 0, fat: 15 },
  turkey: { calories: 170, protein: 29, carbs: 0, fat: 6 },
  pork: { calories: 242, protein: 27, carbs: 0, fat: 14 },
  salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  tuna: { calories: 132, protein: 29, carbs: 0, fat: 1 },
  egg: { calories: 70, protein: 6, carbs: 1, fat: 5 },

  // Dairy
  milk: { calories: 103, protein: 8, carbs: 12, fat: 2 },
  butter: { calories: 102, protein: 0, carbs: 0, fat: 12 },
  cheese: { calories: 113, protein: 7, carbs: 1, fat: 9 },
  yogurt: { calories: 100, protein: 6, carbs: 12, fat: 3 },
  cream: { calories: 52, protein: 0, carbs: 0, fat: 6 },

  // Grains / Starches
  rice: { calories: 205, protein: 4, carbs: 45, fat: 0 },
  pasta: { calories: 200, protein: 7, carbs: 42, fat: 1 },
  bread: { calories: 80, protein: 3, carbs: 15, fat: 1 },
  flour: { calories: 455, protein: 13, carbs: 95, fat: 1 },
  oats: { calories: 150, protein: 5, carbs: 27, fat: 3 },
  potato: { calories: 161, protein: 4, carbs: 37, fat: 0 },
  tortilla: { calories: 140, protein: 4, carbs: 24, fat: 4 },

  // Vegetables
  onion: { calories: 44, protein: 1, carbs: 10, fat: 0 },
  garlic: { calories: 4, protein: 0, carbs: 1, fat: 0 },
  carrot: { calories: 25, protein: 1, carbs: 6, fat: 0 },
  celery: { calories: 10, protein: 0, carbs: 2, fat: 0 },
  tomato: { calories: 22, protein: 1, carbs: 5, fat: 0 },
  lettuce: { calories: 5, protein: 0, carbs: 1, fat: 0 },
  spinach: { calories: 7, protein: 1, carbs: 1, fat: 0 },
  broccoli: { calories: 55, protein: 4, carbs: 11, fat: 1 },
  corn: { calories: 132, protein: 5, carbs: 29, fat: 2 },
  mushroom: { calories: 15, protein: 2, carbs: 2, fat: 0 },
  pepper: { calories: 24, protein: 1, carbs: 6, fat: 0 },

  // Beans / Legumes
  beans: { calories: 225, protein: 15, carbs: 40, fat: 1 },
  blackBean: { calories: 227, protein: 15, carbs: 41, fat: 1 },
  kidneyBean: { calories: 225, protein: 15, carbs: 40, fat: 1 },
  chickpea: { calories: 269, protein: 15, carbs: 45, fat: 4 },
  lentil: { calories: 230, protein: 18, carbs: 40, fat: 1 },

  // Fruits
  apple: { calories: 95, protein: 0, carbs: 25, fat: 0 },
  banana: { calories: 105, protein: 1, carbs: 27, fat: 0 },
  strawberry: { calories: 49, protein: 1, carbs: 12, fat: 0 },
  blueberry: { calories: 84, protein: 1, carbs: 21, fat: 0 },
  lemon: { calories: 17, protein: 1, carbs: 5, fat: 0 },

  // Baking / Pantry
  sugar: { calories: 774, protein: 0, carbs: 200, fat: 0 },
  brownSugar: { calories: 829, protein: 0, carbs: 214, fat: 0 },
  honey: { calories: 64, protein: 0, carbs: 17, fat: 0 },
  oil: { calories: 120, protein: 0, carbs: 0, fat: 14 },
  oliveOil: { calories: 120, protein: 0, carbs: 0, fat: 14 },
  vegetableOil: { calories: 120, protein: 0, carbs: 0, fat: 14 },
  mayonnaise: { calories: 94, protein: 0, carbs: 0, fat: 10 },
  peanutButter: { calories: 190, protein: 8, carbs: 7, fat: 16 },

  // Sauces / Extras
  tomatoSauce: { calories: 80, protein: 3, carbs: 18, fat: 1 },
  salsa: { calories: 20, protein: 1, carbs: 4, fat: 0 },
  ranch: { calories: 130, protein: 0, carbs: 2, fat: 14 },
  sourCream: { calories: 60, protein: 1, carbs: 1, fat: 6 },
  broth: { calories: 15, protein: 1, carbs: 1, fat: 0 },

  // Seasonings - mostly minimal
  salt: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  peppercorn: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  paprika: { calories: 6, protein: 0, carbs: 1, fat: 0 },
  cumin: { calories: 8, protein: 0, carbs: 1, fat: 0 },
  chili: { calories: 8, protein: 0, carbs: 1, fat: 0 },
  cinnamon: { calories: 6, protein: 0, carbs: 2, fat: 0 },
};