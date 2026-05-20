import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

const categoryOptions = [
  "All",
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

function Recipes() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "recipes"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userRecipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecipes(userRecipes);

      setSelectedRecipe((currentSelected: any) => {
        if (currentSelected) return currentSelected;
        return userRecipes[0] || null;
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

const handleDelete = async (id: string) => {
  const confirmed = window.confirm("Delete this recipe?");
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "recipes", id));
    setSuccessMessage("Recipe deleted successfully");

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  } catch (error: any) {
    console.error("Error deleting recipe:", error);
    alert(error.message || "Failed to delete recipe.");
  }
};

  if (authLoading || loading) return <p>Loading recipes...</p>;
  if (!user) return <p>Please log in to view your recipes.</p>;
  if (!recipes.length) {
  return (
    <div className="empty-state">
      <div className="empty-card">
        <h2>No recipes yet</h2>
        <p>Start building your collection by creating your first recipe.</p>

        <Link to="/create-recipe">
          <button className="primary-btn">Create Recipe</button>
        </Link>
      </div>
    </div>
  );
}

const filteredRecipes = recipes.filter((recipe) => {
  const matchesSearch = recipe.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    recipe.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="recipes-page">
      <h2>Your Recipes</h2>

      <div className="recipes-page-actions">
        <Link to="/create-recipe" className="primary-link">
          Create Recipe
        </Link>

        <Link to="/recipe-bank" className="secondary-link">
          Browse Recipe Bank
        </Link>
      </div>

    <div className="recipe-controls">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

      {successMessage && (
        <div className="success-toast">
          {successMessage}
        </div>
      )}

      <div className="recipes-layout">
        <div className="recipe-list">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              className={`recipe-list-item ${
                selectedRecipe?.id === recipe.id ? "active" : ""
              }`}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="recipe-list-title-row">
                <strong>{recipe.title}</strong>
                <span className="category-pill">{recipe.category || "Other"}</span>
              </div>

              <span>{recipe.servings} servings</span>
              <span>
                {recipe.nutritionPerServing?.calories?.toFixed?.(1) ?? 0} cal / serving
              </span>
            </button>
          ))}
        </div>

        <div className="recipe-detail-card">
          {!selectedRecipe ? (
            <p>Select a recipe to view details.</p>
          ) : (
            <>
              <div className="recipe-card-header">
                <h2>{selectedRecipe.title}</h2>

                <div className="recipe-meta-row">
                  <span className="servings-pill">{selectedRecipe.servings} servings</span>

                  <span className="category-pill">
                    {selectedRecipe.category || "Other"}
                  </span>

                  {selectedRecipe.tags?.map((tag: string) => (
                    <span key={tag} className="recipe-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                </div>

              <section>
                <h3>Ingredients</h3>
                <ul className="ingredients-columns">
                  {selectedRecipe.ingredients?.map((ingredient: any, index: number) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Directions</h3>
                <p>{selectedRecipe.instructions}</p>
              </section>

              <section>
                <h3>Nutrition</h3>

                <div className="nutrition-grid">
                  <div>
                    <h4>Total</h4>
                    <p>Calories: {selectedRecipe.nutritionTotals?.calories ?? 0}</p>
                    <p>Protein: {selectedRecipe.nutritionTotals?.protein ?? 0}g</p>
                    <p>Carbs: {selectedRecipe.nutritionTotals?.carbs ?? 0}g</p>
                    <p>Fat: {selectedRecipe.nutritionTotals?.fat ?? 0}g</p>
                  </div>

                  <div>
                    <h4>Per Serving</h4>
                    <p>
                      Calories:{" "}
                      {selectedRecipe.nutritionPerServing?.calories?.toFixed?.(1) ?? 0}
                    </p>
                    <p>
                      Protein:{" "}
                      {selectedRecipe.nutritionPerServing?.protein?.toFixed?.(1) ?? 0}g
                    </p>
                    <p>
                      Carbs:{" "}
                      {selectedRecipe.nutritionPerServing?.carbs?.toFixed?.(1) ?? 0}g
                    </p>
                    <p>
                      Fat:{" "}
                      {selectedRecipe.nutritionPerServing?.fat?.toFixed?.(1) ?? 0}g
                    </p>
                  </div>
                </div>
              </section>

              <div className="recipe-actions">
                <Link to={`/edit-recipe/${selectedRecipe.id}`}>
                  <button type="button">Edit Recipe</button>
                </Link>

                <button type="button" onClick={() => handleDelete(selectedRecipe.id)}>
                  Delete Recipe
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
