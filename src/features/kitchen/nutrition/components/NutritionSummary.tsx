import type { NutritionResults } from "../types/nutritionProfile";

interface NutritionSummaryProps {
  results: NutritionResults | null;
  onSave: () => void;
  isSaving: boolean;
  hasCalculated: boolean;
}

function NutritionSummary({
  results,
  onSave,
  isSaving,
  hasCalculated,
}: NutritionSummaryProps) {
  if (!results) {
    return (
      <section className="nutrition-summary-card empty-nutrition-summary">
        <h2>Your Results</h2>
        <p>Enter your details and calculate your estimated wellness targets.</p>
      </section>
    );
  }

  return (
    <section className="nutrition-summary-card">
      <h2>Your Estimated Targets</h2>

      <div className="nutrition-results-grid">
        <div>
          <span>BMR</span>
          <strong>{results.bmr}</strong>
          <p>calories/day</p>
        </div>

        <div>
          <span>Maintenance</span>
          <strong>{results.maintenanceCalories}</strong>
          <p>calories/day</p>
        </div>

        <div>
          <span>Goal Calories</span>
          <strong>{results.goalCalories}</strong>
          <p>calories/day</p>
        </div>

        <div>
          <span>Protein</span>
          <strong>{results.proteinGrams}g</strong>
          <p>per day</p>
        </div>

        <div>
          <span>Carbs</span>
          <strong>{results.carbsGrams}g</strong>
          <p>per day</p>
        </div>

        <div>
          <span>Fat</span>
          <strong>{results.fatGrams}g</strong>
          <p>per day</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving || !hasCalculated}
        className="primary-link nutrition-save-button"
      >
        {isSaving ? "Saving..." : "Save Targets"}
      </button>

      <p className="nutrition-disclaimer">
        These are general estimates for planning purposes only and are not
        medical advice.
      </p>
    </section>
  );
}

export default NutritionSummary;