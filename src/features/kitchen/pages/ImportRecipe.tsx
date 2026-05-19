import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ImportRecipe() {
  const [recipeText, setRecipeText] = useState("");
  const [parsedTitle, setParsedTitle] = useState("");
  const [parsedIngredients, setParsedIngredients] = useState("");
  const [parsedInstructions, setParsedInstructions] = useState("");

  const navigate = useNavigate();

  const handleParseRecipe = () => {
    const lines = recipeText
      .split("\n")
      .map((line) =>
        line
          .replace(/•/g, "")
          .replace(/→/g, "")
          .replace(/¶/g, "")
          .trim()
      )
      .filter(Boolean);

    const title = lines[0] || "";

    const instructionStartIndex = lines.findIndex((line) => {
      const lower = line.toLowerCase();

      return (
        lower.includes("instructions") ||
        lower.includes("directions") ||
        lower.includes("method") ||
        lower.includes("preparation") ||
        lower.startsWith("place ") ||
        lower.startsWith("mix ") ||
        lower.startsWith("combine ") ||
        lower.startsWith("bake ") ||
        lower.startsWith("cook ") ||
        lower.startsWith("fry ")
      );
    });

    const ingredientLines =
      instructionStartIndex > -1
        ? lines.slice(1, instructionStartIndex)
        : lines.slice(1);

    const instructionLines =
      instructionStartIndex > -1 ? lines.slice(instructionStartIndex) : [];

    setParsedTitle(title);
    setParsedIngredients(ingredientLines.join("\n"));
    setParsedInstructions(instructionLines.join("\n"));
  };

  const handleContinue = () => {
    const ingredientLines = parsedIngredients
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    navigate("/create-recipe", {
      state: {
        importedTitle: parsedTitle,
        importedIngredients: ingredientLines,
        importedInstructions: parsedInstructions,
      },
    });
  };

  return (
    <div className="import-page">
      <div className="import-card">
        <h2>Import Recipe</h2>

        <p className="page-description">
          Paste a simple recipe below. You can review and edit the detected
          title, ingredients, and instructions before creating the recipe.
        </p>

        <div className="import-recipe-actions">
          <Link to="/create-recipe" className="secondary-link">
            Manual Entry
          </Link>

          <Link to="/recipes" className="secondary-link">
            My Recipes
          </Link>

          <Link to="/recipe-bank" className="secondary-link">
            Recipe Bank
          </Link>
        </div>

        <p className="helper-text">
          Simple ingredient lists and instruction sections work best. Recipes
          copied from Word may need light cleanup.
        </p>

        <textarea
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          placeholder={`Example:

Crab Rangoon

8 oz softened cream cheese
4-6 oz crab meat
1 tsp garlic powder

Instructions
Place mixture into wonton wrappers.
Seal edges and fry until golden.`}
          className="import-textarea"
        />

        <button type="button" onClick={handleParseRecipe}>
          Parse Recipe
        </button>

        {(parsedTitle || parsedIngredients || parsedInstructions) && (
          <div className="import-preview">
            <section>
              <h3>Detected Title</h3>
              <input
                type="text"
                value={parsedTitle}
                onChange={(e) => setParsedTitle(e.target.value)}
              />
            </section>

            <section>
              <h3>Detected Ingredients</h3>
              <textarea
                value={parsedIngredients}
                onChange={(e) => setParsedIngredients(e.target.value)}
                className="import-review-textarea"
              />
            </section>

            <section>
              <h3>Detected Instructions</h3>
              <textarea
                value={parsedInstructions}
                onChange={(e) => setParsedInstructions(e.target.value)}
                className="import-review-textarea"
              />
            </section>

            <button type="button" onClick={handleContinue}>
              Continue to Create Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportRecipe;