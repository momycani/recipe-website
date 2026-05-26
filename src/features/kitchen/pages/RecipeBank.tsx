import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase";
import {
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

function RecipeBank() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const formatServings = (servings: number) => {
    return servings === 1 ? "1 serving" : `${servings} servings`;
  };

  const formatTag = (tag: string) => {
    return `#${tag.replace(/\s+/g, "")}`;
  };

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

      setSelectedRecipe((currentSelected: any) => {
        if (!currentSelected) return publicRecipes[0] || null;

        const updatedSelected = publicRecipes.find(
          (recipe) => recipe.id === currentSelected.id
        );

        return updatedSelected || publicRecipes[0] || null;
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedRecipeIds([]);
      return;
    }

    const q = query(collection(db, "recipes"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const copiedIds = snapshot.docs
        .map((doc) => doc.data().copiedFromRecipeId)
        .filter(Boolean);

      setSavedRecipeIds(copiedIds);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map((doc) => doc.data().recipeId);
      setFavoriteIds(ids);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveToMyRecipes = async () => {
    if (isSaving) return;

    if (!user) {
      setSuccessMessage("Please log in to save recipes.");
      return;
    }

    if (!selectedRecipe) return;

    if (
      selectedRecipe.userId === user.uid ||
      savedRecipeIds.includes(selectedRecipe.id)
    ) {
      setSuccessMessage("This recipe is already in My Recipes.");
      return;
    }

    setIsSaving(true);

    try {
      await addDoc(collection(db, "recipes"), {
        title: selectedRecipe.title,
        category: selectedRecipe.tags?.[0] || selectedRecipe.category || "Other",
        tags: selectedRecipe.tags || [],
        servings: selectedRecipe.servings,
        ingredients: selectedRecipe.ingredients || [],
        instructions: selectedRecipe.instructions,
        nutritionTotals: selectedRecipe.nutritionTotals,
        nutritionPerServing: selectedRecipe.nutritionPerServing,
        userId: user.uid,
        visibility: "private",
        copiedFromRecipeId: selectedRecipe.id,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("Recipe saved to My Recipes!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error: any) {
      console.error("Error saving recipe copy:", error);
      setSuccessMessage(error.message || "Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !selectedRecipe) return;

    const isFavorite = favoriteIds.includes(selectedRecipe.id);

    try {
      if (isFavorite) {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid),
          where("recipeId", "==", selectedRecipe.id)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(async (docItem) => {
          await deleteDoc(doc(db, "favorites", docItem.id));
        });
      } else {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          recipeId: selectedRecipe.id,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    const title = recipe.title?.toLowerCase() || "";
    const instructions = recipe.instructions?.toLowerCase() || "";

    const tags = Array.isArray(recipe.tags)
      ? recipe.tags.join(" ").toLowerCase()
      : "";

    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
          .map((ingredient: any) => ingredient.name || "")
          .join(" ")
          .toLowerCase()
      : "";

    return (
      title.includes(search) ||
      tags.includes(search) ||
      ingredients.includes(search) ||
      instructions.includes(search)
    );
  });

  if (loading) return <p>Loading recipe bank...</p>;

  const alreadySaved =
    selectedRecipe &&
    user &&
    (selectedRecipe.userId === user.uid ||
      savedRecipeIds.includes(selectedRecipe.id));

  return (
    <div className="recipes-page">
      <div className="page-header">
        <h2>Recipe Bank</h2>

        <div className="recipes-page-actions">
          <Link to="/create-recipe" className="primary-link">
            Create Recipe
          </Link>

          <Link to="/recipes" className="secondary-link">
            My Recipes
          </Link>
        </div>

        <div className="recipe-controls">
          <input
            type="text"
            placeholder="Search public recipes by title, tag, ingredient, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <p className="page-description">
          Browse shared community recipes and save copies to your own
          collection.
        </p>
      </div>

      {!recipes.length ? (
        <div className="empty-state">
          <div className="empty-card">
            <h2>No public recipes yet</h2>
            <p>Public recipes will appear here once users add them.</p>
          </div>
        </div>
      ) : (
        <div className="recipes-layout">
          <div className="recipe-list">
            {!filteredRecipes.length ? (
              <div className="empty-list-message">
                No recipes match your search.
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
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
                  </div>

                  <span>{formatServings(recipe.servings)}</span>

                  {recipe.tags?.length > 0 && (
                    <div className="recipe-tags">
                      {recipe.tags.map((tag: string) => (
                        <span key={tag} className="recipe-tag">
                          {formatTag(tag)}
                        </span>
                      ))}
                    </div>
                  )}

                  <span>
                    {recipe.nutritionPerServing?.calories?.toFixed?.(1) ?? 0}{" "}
                    cal / serving
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="recipe-detail-card">
            {!selectedRecipe ? (
              <p>Select a recipe to view details.</p>
            ) : (
              <>
                <div className="recipe-card-header">
                  <h2>{selectedRecipe.title}</h2>

                  <div className="recipe-meta-row">
                    <span className="servings-pill">
                      {formatServings(selectedRecipe.servings)}
                    </span>

                    {selectedRecipe.tags?.map((tag: string) => (
                      <span key={tag} className="recipe-tag">
                        {formatTag(tag)}
                      </span>
                    ))}
                  </div>
                </div>

                <section>
                  <h3>Ingredients</h3>

                  <ul className="ingredients-columns">
                    {selectedRecipe.ingredients?.map(
                      (ingredient: any, index: number) => (
                        <li key={index}>
                          {`${ingredient.quantity || ""} ${
                            ingredient.unit || ""
                          } ${ingredient.name || ""}`.trim()}
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

                  <p className="helper-text nutrition-disclaimer-text">
    Nutrition values are estimates for planning purposes only and may vary based
    on brands, ingredient size, preparation method, and serving size.
  </p>

                  <div className="nutrition-grid">
                    <div>
                      <h4>Total</h4>
                      <p>
                        Calories:{" "}
                        {selectedRecipe.nutritionTotals?.calories ?? 0}
                      </p>
                      <p>
                        Protein:{" "}
                        {selectedRecipe.nutritionTotals?.protein ?? 0}g
                      </p>
                      <p>
                        Carbs: {selectedRecipe.nutritionTotals?.carbs ?? 0}g
                      </p>
                      <p>Fat: {selectedRecipe.nutritionTotals?.fat ?? 0}g</p>
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

                  {successMessage && (
                    <div className="success-toast detail-toast">
                      {successMessage}
                    </div>
                  )}

                  <div className="recipe-actions">
                    <button type="button" onClick={handleToggleFavorite}>
                      {favoriteIds.includes(selectedRecipe.id)
                        ? "★ Favorited"
                        : "☆ Favorite"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveToMyRecipes}
                      disabled={!user || isSaving || Boolean(alreadySaved)}
                    >
                      {!user
                        ? "Log in to Save"
                        : selectedRecipe?.userId === user?.uid
                        ? "Already in My Recipes"
                        : alreadySaved
                        ? "Saved to My Recipes"
                        : isSaving
                        ? "Saving..."
                        : "Save to My Recipes"}
                    </button>
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