import { useState } from "react";
import type { Ingredient } from "../types/nutrition";
import { nutritionData } from "../data/nutritionData";
import type { Nutrition } from "../types/nutrition";

function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "", unit: "" },
  ]);

  const handleIngredientChange = (
  index: number,
  field: keyof Ingredient,
  value: string
) => {
  const updatedIngredients = [...ingredients];

  if (field === "name" || field === "quantity" || field === "unit") {
    updatedIngredients[index][field] = value;
  }

  setIngredients(updatedIngredients);
};

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", unit: "" },
    ]);
  };

  const removeIngredient = (indexToRemove: number) => {
    if (ingredients.length === 1) return;

    const updatedIngredients = ingredients.filter(
      (_, index) => index !== indexToRemove
    );
    setIngredients(updatedIngredients);
  };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validIngredients = ingredients.filter(
        (ingredient) => ingredient.name.trim() !== ""
    );

    if (!title.trim()) {
        setError("Recipe title is required.");
        return;
    }

    if (validIngredients.length === 0) {
        setError("At least one ingredient name is required.");
        return;
    }

    if (!instructions.trim()) {
        setError("Instructions are required.");
        return;
    }

    const recipeData = {
        title,
        servings,
        ingredients: validIngredients,
        instructions,
    };

    setError("");
    console.log("Clean Recipe Data:", recipeData);
    }; 
    
    const normalizeIngredientName = (name: string) => {
    const cleanedName = name.toLowerCase().trim();

    if (cleanedName.endsWith("es")) {
        return cleanedName.slice(0, -2);
    }

    if (cleanedName.endsWith("s")) {
        return cleanedName.slice(0, -1);
    }

    return cleanedName;
    };

const calculateNutrition = (): Nutrition => {
  let totals: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  ingredients.forEach((ingredient) => {
    const name = normalizeIngredientName(ingredient.name);
    const data = nutritionData[name];
    const quantity = Number(ingredient.quantity) || 1;

    if (data) {
      totals.calories += data.calories * quantity;
      totals.protein += data.protein * quantity;
      totals.carbs += data.carbs * quantity;
      totals.fat += data.fat * quantity;
    }
  });

  return totals;
}; 

 const nutritionTotals = calculateNutrition();
 const nutritionPerServing = {
  calories: servings > 0 ? nutritionTotals.calories / servings : 0,
  protein: servings > 0 ? nutritionTotals.protein / servings : 0,
  carbs: servings > 0 ? nutritionTotals.carbs / servings : 0,
  fat: servings > 0 ? nutritionTotals.fat / servings : 0,
};

const validIngredients = ingredients.filter(
  (ingredient) => ingredient.name.trim() !== ""
);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Recipe</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <div>
          <label>Recipe Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Servings:</label>
          <br />
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h3>Ingredients</h3>

          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                style={{ marginLeft: "0.5rem" }}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addIngredient}>
            Add Ingredient
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Instructions:</label>
          <br />
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">Save Recipe</button>
        </div>
      </form>


<div
  style={{
    marginTop: "2rem",
    padding: "1.5rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  }}
>
  <h2>{title || "Recipe Preview"}</h2>
  <p>
    <strong>Servings:</strong> {servings}
  </p>

<div style={{ marginTop: "1rem" }}>
  <h3>Nutrition</h3>
  <p>
    <strong>Total:</strong>
  </p>
  <p>Calories: {nutritionTotals.calories}</p>
  <p>Protein: {nutritionTotals.protein}g</p>
  <p>Carbs: {nutritionTotals.carbs}g</p>
  <p>Fat: {nutritionTotals.fat}g</p>

  <div style={{ marginTop: "1rem" }}>
    <p>
      <strong>Per Serving:</strong>
    </p>
    <p>Calories: {nutritionPerServing.calories.toFixed(1)}</p>
    <p>Protein: {nutritionPerServing.protein.toFixed(1)}g</p>
    <p>Carbs: {nutritionPerServing.carbs.toFixed(1)}g</p>
    <p>Fat: {nutritionPerServing.fat.toFixed(1)}g</p>
  </div>
</div>

  <div style={{ marginTop: "1rem" }}>
    <h3>Ingredients</h3>
    <ul>
      {validIngredients.length > 0 ? (
        validIngredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))
      ) : (
        <li>No ingredients yet</li>
      )}
    </ul>
  </div>

  <div style={{ marginTop: "1rem" }}>
    <h3>Instructions</h3>
    <p>{instructions || "No instructions yet"}</p>
  </div>
</div>

    </div>
  );
}

export default CreateRecipe;