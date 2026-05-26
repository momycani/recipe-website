import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";
import { nutritionData } from "../data/nutritionData";
import type { Ingredient, Nutrition } from "../types/nutrition";

const tagOptions = [
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
  "Italian",
  "Mexican",
  "Asian",
  "Gluten Free",
  "Dairy Free",
  "Low Carb",
  "Quick Meal",
  "Freezer Friendly",
  "Family Favorite",
  "Anti-Inflammatory",
  "Mediterranean",
  "Slow Cooker",
  "Pressure Cooker"
];

function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = Boolean(id);

  const parseIngredientLine = (line: string): Ingredient => {
    const trimmedLine = line.trim();

    const match = trimmedLine.match(
      /^([\d¼½¾⅓⅔⅛⅜⅝⅞./\s-]+)\s*(tsp|tbsp|cup|cups|fl oz|oz|lb|lbs|g|kg|ml|l|can|cans|package|packages|clove|cloves|slice|slices|piece|pieces|small|medium|large)?\s+(.+)$/i
    );

    if (!match) {
      return {
        quantity: "",
        unit: "",
        name: trimmedLine,
      };
    }

    return {
      quantity: match[1].trim(),
      unit: match[2] || "",
      name: match[3].trim(),
    };
  };

  const parsedIngredients: Ingredient[] = ingredientsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseIngredientLine);

  useEffect(() => {
    const state = location.state as {
      importedTitle?: string;
      importedIngredients?: string[];
      importedInstructions?: string;
      importedTags?: string[];
    } | null;

    if (!state || isEditMode) return;

    if (state.importedTitle) {
      setTitle(state.importedTitle);
    }

    if (state.importedInstructions) {
      setInstructions(state.importedInstructions);
    }

    if (state.importedIngredients?.length) {
      setIngredientsText(state.importedIngredients.join("\n"));
    }

    if (state.importedTags?.length) {
      setTags(state.importedTags);
    }
  }, [location.state, isEditMode]);

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
        setIsPublic(recipeData.visibility === "public");
        setInstructions(recipeData.instructions || "");

        const savedTags = Array.isArray(recipeData.tags)
          ? recipeData.tags
          : [];

        const categoryAsTag =
          recipeData.category && recipeData.category !== "Other"
            ? [recipeData.category]
            : [];

        setTags(Array.from(new Set([...categoryAsTag, ...savedTags])));

        const existingIngredients = recipeData.ingredients || [];

        const ingredientLines = existingIngredients
          .map((ingredient: Ingredient) =>
            `${ingredient.quantity || ""} ${ingredient.unit || ""} ${
              ingredient.name || ""
            }`.trim()
          )
          .filter(Boolean)
          .join("\n");

        setIngredientsText(ingredientLines);
      } catch (error) {
        console.error("Error loading recipe:", error);
        setError("Failed to load recipe.");
      } finally {
        setIsLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const normalizeIngredientName = (name: string) => {
    const cleanedName = name.toLowerCase().trim();

    const aliases: Record<string, string> = {
      "black beans": "blackBean",
      "black bean": "blackBean",
      "kidney beans": "kidneyBean",
      "kidney bean": "kidneyBean",
      "brown sugar": "brownSugar",
      "olive oil": "oliveOil",
      "vegetable oil": "vegetableOil",
      "peanut butter": "peanutButter",
      "tomato sauce": "tomatoSauce",
      "sour cream": "sourCream",
      "chicken broth": "broth",
      "beef broth": "broth",
      "vegetable broth": "broth",
    };

    if (aliases[cleanedName]) return aliases[cleanedName];

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

    parsedIngredients.forEach((ingredient) => {
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

  const previewIngredients = parsedIngredients.filter(
    (ingredient) => ingredient.name.trim() !== ""
  );

  const primaryTag = tags[0] || "Other";

  const resetForm = () => {
    setTitle("");
    setTags([]);
    setServings(1);
    setInstructions("");
    setIngredientsText("");
    setIsPublic(false);
  };

  const handleTagToggle = (tag: string) => {
    setTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validIngredients = parsedIngredients.filter(
      (ingredient) => ingredient.name.trim() !== ""
    );

    if (!title.trim()) {
      setError("Recipe title is required.");
      return;
    }

    if (validIngredients.length === 0) {
      setError("At least one ingredient is required.");
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
        title: title.trim(),
        category: primaryTag,
        tags,
        servings,
        ingredients: validIngredients,
        instructions: instructions.trim(),
        nutritionTotals,
        nutritionPerServing,
        userId: user.uid,
        visibility: isPublic ? "public" : "private",
        createdAt: serverTimestamp(),
      };

      if (isEditMode && id) {
        const recipeRef = doc(db, "recipes", id);

        await updateDoc(recipeRef, {
          title: title.trim(),
          category: primaryTag,
          tags,
          servings,
          ingredients: validIngredients,
          instructions: instructions.trim(),
          nutritionTotals,
          nutritionPerServing,
          visibility: isPublic ? "public" : "private",
          updatedAt: serverTimestamp(),
        });

        navigate("/recipes");
      } else {
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
      <h2>{isEditMode ? "Edit Recipe" : "Create Recipe"}</h2>

      <p className="create-recipe-intro">
        Add your recipe details, paste ingredients one per line, choose helpful
        tags, and preview the finished recipe before saving.
      </p>

      {!isEditMode && (
        <div className="create-recipe-actions">
          <Link to="/create-recipe" className="primary-link">
            Manual Entry
          </Link>

          <Link to="/import-recipe" className="secondary-link">
            Import Recipe
          </Link>

          <Link to="/recipes" className="secondary-link">
            My Recipes
          </Link>

          <Link to="/recipe-bank" className="secondary-link">
            Recipe Bank
          </Link>
        </div>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className={`recipe-form ${isSaving ? "saving" : ""}`}
      >
        <div className="form-group">
          <label htmlFor="recipe-title">Recipe Title:</label>
          <input
            id="recipe-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isSaving}
            />

            <div>
              <span>Share this recipe to the public recipe bank</span>

              <p className="helper-text">
                Public recipes appear in the Recipe Bank for everyone to view.
              </p>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label>Tags:</label>

          <p className="helper-text">
            Choose any tags that fit. These work like recipe hashtags for
            organizing and searching.
          </p>

          <div className="tag-options">
            {tagOptions.map((tag) => (
              <label key={tag} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  disabled={isSaving}
                />

                <span>#{tag.replace(/\s+/g, "")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings:</label>
          <input
            id="servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients:</label>
          <textarea
            id="ingredients"
            className="recipe-textarea ingredients-textarea"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={`1 lb ground beef
1 small onion, diced
2 cloves garlic, minced
1 tsp salt
1/2 tsp black pepper`}
            rows={8}
            disabled={isSaving}
          />

          <p className="form-helper">
            Enter one ingredient per line, exactly how you want it to appear on
            the recipe.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
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

        <div className="recipe-meta-row">
          <span className="servings-pill">{servings} servings</span>

          {tags.map((tag) => (
            <span key={tag} className="recipe-tag">
              #{tag.replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        <div className="preview-section">
          <h3>Nutrition</h3>

          <p className="helper-text nutrition-disclaimer-text">
  Nutrition values are estimates for planning purposes only and may vary based
  on brands, ingredient size, preparation method, and serving size.
</p>

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
                <li key={`${ingredient.name}-${index}`}>
                  {`${ingredient.quantity || ""} ${ingredient.unit || ""} ${
                    ingredient.name
                  }`.trim()}
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