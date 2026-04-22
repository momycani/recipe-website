import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Recipes() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "recipes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userRecipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecipes(userRecipes);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "recipes", id));
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      alert(error.message || "Failed to delete recipe.");
    }
  };

  if (authLoading || loading) return <p>Loading recipes...</p>;

  if (!user) {
    return <p>Please log in to view your recipes.</p>;
  }

  if (!recipes.length) {
    return <p>No recipes yet. Create your first one!</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Recipes</h2>

      {recipes.map((recipe: any) => (
        <div
          key={recipe.id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>{recipe.title}</h3>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>

          <div style={{ marginTop: "0.75rem" }}>
            <h4>Nutrition</h4>
            <p>
              <strong>Total:</strong>
            </p>
            <p>Calories: {recipe.nutritionTotals?.calories ?? 0}</p>
            <p>Protein: {recipe.nutritionTotals?.protein ?? 0}g</p>
            <p>Carbs: {recipe.nutritionTotals?.carbs ?? 0}g</p>
            <p>Fat: {recipe.nutritionTotals?.fat ?? 0}g</p>

            <div style={{ marginTop: "0.5rem" }}>
              <p>
                <strong>Per Serving:</strong>
              </p>
              <p>Calories: {recipe.nutritionPerServing?.calories?.toFixed?.(1) ?? 0}</p>
              <p>Protein: {recipe.nutritionPerServing?.protein?.toFixed?.(1) ?? 0}g</p>
              <p>Carbs: {recipe.nutritionPerServing?.carbs?.toFixed?.(1) ?? 0}g</p>
              <p>Fat: {recipe.nutritionPerServing?.fat?.toFixed?.(1) ?? 0}g</p>
            </div>
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients?.map((ingredient: any, index: number) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <h4>Instructions</h4>
            <p>{recipe.instructions}</p>
          </div>
          
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <Link to={`/edit-recipe/${recipe.id}`}>
              <button type="button">Edit Recipe</button>
            </Link>

            <button type="button" onClick={() => handleDelete(recipe.id)}>
              Delete Recipe
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="button" onClick={() => handleDelete(recipe.id)}>
              Delete Recipe
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Recipes;
