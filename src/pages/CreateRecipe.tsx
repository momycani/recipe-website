import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { nutritionData } from "../data/nutritionData";
import type { Ingredient, Nutrition } from "../types/nutrition";

const unitOptions = [
  "tsp",
  "tbsp",
  "cup",
  "cups",
  "fl oz",
  "pint",
  "quart",
  "gallon",
  "ml",
  "l",
  "oz",
  "lb",
  "g",
  "kg",
  "pinch",
  "dash",
  "clove",
  "cloves",
  "slice",
  "slices",
  "piece",
  "pieces",
  "each",
  "box",
  "boxes",
  "can",
  "cans",
  "package",
  "packages",
  "serving",
  "servings",
  "whole",
];

const categoryOptions = [
  "Breakfast",
  "Chicken",
  "Beef",
  "Pork",
  "Seafood",
  "Pasta",
  "Casserole",
  "Soup",
  "Salad",
  "Dessert",
  "Vegetarian",
  "Side Dish",
  "Other",
];

function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "", unit: "" },
  ]);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [category, setCategory] = useState("Other");

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || !user) return;

      setIsLoadingRecipe(true);

      try {
        const recipeRef = doc(db, "recipes", id);
        const recipeSnap = await getDoc(recipeRef);

        if (!recipeSnap.exists()) {
          setError("Recipe not found.");
          return;
        }

        const recipeData = recipeSnap.data();

        if (recipeData.userId !== user.uid) {
          setError("You are not authorized to edit this recipe.");
          return;
        }

        setTitle(recipeData.title || "");
        setServings(recipeData.servings || 1);
        setCategory(recipeData.category || "Other");
        setInstructions(recipeData.instructions || "");
        setIngredients(
          recipeData.ingredients || [{ name: "", quantity: "", unit: "" }]
        );
      } catch (error) {
        console.error("Error loading recipe:", error);
        setError("Failed to load recipe.");
      } finally {
        setIsLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (indexToRemove: number) => {
    if (ingredients.length === 1) return;

    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const normalizeIngredientName = (name: string) => {
    const cleanedName = name.toLowerCase().trim();

    if (cleanedName.endsWith("es")) return cleanedName.slice(0, -2);
    if (cleanedName.endsWith("s")) return cleanedName.slice(0, -1);

    return cleanedName;
  };

  const calculateNutrition = (): Nutrition => {
    const totals: Nutrition = {
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

  const previewIngredients = ingredients.filter(
    (ingredient) => ingredient.name.trim() !== ""
  );

  const resetForm = () => {
    setTitle("");
    setCategory("Other");
    setServings(1);
    setInstructions("");
    setIngredients([{ name: "", quantity: "", unit: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (!user) {
      setError("You must be logged in to create a recipe.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const recipeData = {
        title,
        category,
        servings,
        ingredients: validIngredients,
        instructions,
        nutritionTotals,
        nutritionPerServing,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      if (isEditMode && id) {
        const recipeRef = doc(db, "recipes", id);

        await updateDoc(recipeRef, {
          title,
          category,
          servings,
          ingredients: validIngredients,
          instructions,
          nutritionTotals,
          nutritionPerServing,
          updatedAt: serverTimestamp(),
        });

        navigate("/recipes");
      } else {

        console.log("Saving recipe data:", recipeData);

        const docRef = await addDoc(collection(db, "recipes"), recipeData);
        console.log("Recipe saved with ID:", docRef.id);

        resetForm();
        setSuccessMessage("Recipe saved successfully!");
      }
    } catch (error: any) {
      console.error("Failed to save recipe:", error);
      setError(error.message || "Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditMode && isLoadingRecipe) {
    return <p className="page-message">Loading recipe...</p>;
  }

  return (
    <div className="create-recipe-page">
      <datalist id="unit-options">
        {unitOptions.map((unit) => (
          <option key={unit} value={unit} />
        ))}
      </datalist>

      <h2>{isEditMode ? "Edit Recipe" : "Create Recipe"}</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className={`recipe-form ${isSaving ? "saving" : ""}`}
      >
        <div className="form-group">
          <label>Recipe Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSaving}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Servings:</label>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            disabled={isSaving}
          />
        </div>

        <div className="form-section">
          <h3>Ingredients</h3>

          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                disabled={isSaving}
              />

              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                disabled={isSaving}
              />

              <input
                type="text"
                placeholder="Unit"
                list="unit-options"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                disabled={isSaving}
              />

              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={isSaving || ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addIngredient} disabled={isSaving}>
            Add Ingredient
          </button>
        </div>

        <div className="form-group">
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving && <span className="spinner" />}
          {isSaving
            ? isEditMode
              ? "Updating..."
              : "Saving..."
            : isEditMode
            ? "Update Recipe"
            : "Save Recipe"}
        </button>
      </form>

      <div className="recipe-preview-card">
        <h2>{title || "Recipe Preview"}</h2>

        <p>
          <strong>Servings:</strong> {servings}
        </p>

        <div className="preview-section">
          <h3>Nutrition</h3>

          <div className="nutrition-grid">
            <div className="nutrition-column">
              <p>
                <strong>Total:</strong>
              </p>
              <p>Calories: {nutritionTotals.calories}</p>
              <p>Protein: {nutritionTotals.protein}g</p>
              <p>Carbs: {nutritionTotals.carbs}g</p>
              <p>Fat: {nutritionTotals.fat}g</p>
            </div>

            <div className="nutrition-column">
              <p>
                <strong>Per Serving:</strong>
              </p>
              <p>Calories: {nutritionPerServing.calories.toFixed(1)}</p>
              <p>Protein: {nutritionPerServing.protein.toFixed(1)}g</p>
              <p>Carbs: {nutritionPerServing.carbs.toFixed(1)}g</p>
              <p>Fat: {nutritionPerServing.fat.toFixed(1)}g</p>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h3>Ingredients</h3>
          <ul>
            {previewIngredients.length > 0 ? (
              previewIngredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))
            ) : (
              <li>No ingredients yet</li>
            )}
          </ul>
        </div>

        <div className="preview-section">
          <h3>Instructions</h3>
          <p>{instructions || "No instructions yet"}</p>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipe;