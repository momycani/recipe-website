import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function RecipeBank() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "recipes"),
      where("visibility", "==", "public")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const publicRecipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecipes(publicRecipes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading recipe bank...</p>;

  return (
    <div className="recipes-page">
      <h2>Recipe Bank</h2>

      {!recipes.length ? (
        <div className="empty-state">
          <div className="empty-card">
            <h2>No public recipes yet</h2>
            <p>Public recipes will appear here once users add them.</p>
          </div>
        </div>
      ) : (
        <div className="recipes-layout">
          {/* LEFT LIST */}
          <div className="recipe-list">
            {recipes.map((recipe) => (
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
                  <span className="category-pill">
                    {recipe.category || "Other"}
                  </span>
                </div>

                <span>{recipe.servings} servings</span>

                <span>
                  {recipe.nutritionPerServing?.calories?.toFixed?.(1) ?? 0} cal /
                  serving
                </span>
              </button>
            ))}
          </div>

          {/* RIGHT DETAIL CARD */}
          <div className="recipe-detail-card">
            {!selectedRecipe ? (
              <p>Select a recipe to view details.</p>
            ) : (
              <>
                <div className="recipe-card-header">
                  <h2>{selectedRecipe.title}</h2>

                  <div className="recipe-meta-row">
                    <span>{selectedRecipe.servings} servings</span>
                    <span className="category-pill">
                      {selectedRecipe.category || "Other"}
                    </span>
                  </div>
                </div>

                <section>
                  <h3>Ingredients</h3>
                  <ul className="ingredients-columns">
                    {selectedRecipe.ingredients?.map(
                      (ingredient: any, index: number) => (
                        <li key={index}>
                          {ingredient.quantity} {ingredient.unit}{" "}
                          {ingredient.name}
                        </li>
                      )
                    )}
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
                      <p>
                        Calories: {selectedRecipe.nutritionTotals?.calories ?? 0}
                      </p>
                      <p>
                        Protein: {selectedRecipe.nutritionTotals?.protein ?? 0}g
                      </p>
                      <p>
                        Carbs: {selectedRecipe.nutritionTotals?.carbs ?? 0}g
                      </p>
                      <p>
                        Fat: {selectedRecipe.nutritionTotals?.fat ?? 0}g
                      </p>
                    </div>

                    <div>
                      <h4>Per Serving</h4>
                      <p>
                        Calories:{" "}
                        {selectedRecipe.nutritionPerServing?.calories?.toFixed?.(
                          1
                        ) ?? 0}
                      </p>
                      <p>
                        Protein:{" "}
                        {selectedRecipe.nutritionPerServing?.protein?.toFixed?.(
                          1
                        ) ?? 0}
                        g
                      </p>
                      <p>
                        Carbs:{" "}
                        {selectedRecipe.nutritionPerServing?.carbs?.toFixed?.(
                          1
                        ) ?? 0}
                        g
                      </p>
                      <p>
                        Fat:{" "}
                        {selectedRecipe.nutritionPerServing?.fat?.toFixed?.(
                          1
                        ) ?? 0}
                        g
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeBank;