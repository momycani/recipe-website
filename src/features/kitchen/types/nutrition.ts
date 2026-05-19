export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
  nutrition?: Nutrition;
};

export type Recipe = {
  title: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string;
};