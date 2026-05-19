import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase/firebase";
import NutritionCalculator from "../components/NutritionCalculator";
import NutritionSummary from "../components/NutritionSummary";
import type {
  NutritionFormData,
  NutritionResults,
} from "../types/nutritionProfile";

function NutritionHome() {
  const [formData, setFormData] = useState<NutritionFormData | null>(null);
  const [results, setResults] = useState<NutritionResults | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    const loadSavedNutritionProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      try {
        const profileRef = doc(db, "nutritionProfiles", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const savedProfile = profileSnap.data();

          setFormData(savedProfile.formData as NutritionFormData);
          setResults(savedProfile.results as NutritionResults);
          setMessage("Saved nutrition targets loaded.");
        }
      } catch (error) {
        setMessage("Unable to load saved nutrition targets.");
      }
    };

    loadSavedNutritionProfile();
  }, []);

  const handleCalculate = (
    calculatedFormData: NutritionFormData,
    calculatedResults: NutritionResults
  ) => {
    setFormData(calculatedFormData);
    setResults(calculatedResults);
    setHasCalculated(true);
    setMessage("Targets calculated. Save them to keep these results.");
  };

  const handleSaveTargets = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Please log in to save your nutrition targets.");
      return;
    }

    if (!formData || !results) {
      setMessage("Calculate your targets before saving.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const profileRef = doc(db, "nutritionProfiles", user.uid);

      await setDoc(
        profileRef,
        {
          userId: user.uid,
          formData,
          results,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage(
        "Nutrition targets saved. You can recalculate and update them anytime."
      );
      setHasCalculated(false);
    } catch (error) {
         console.error("Nutrition save error:", error);
      setMessage("Unable to save nutrition targets. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="nutrition-page">
      <section className="kitchen-subpage-header">
        <p className="kitchen-eyebrow">Nutrition &amp; Fitness</p>
        <h1>Estimate your wellness targets.</h1>

        <p>
          Calculate calorie and macro needs, save your nutrition targets, and
          adjust your goals as your activity level or wellness plan changes.
        </p>

        <div className="nutrition-page-actions">
          <Link to="/kitchen" className="secondary-link">
            Back to Kitchen
          </Link>

          <Link to="/create-recipe" className="secondary-link">
            Create Recipe
          </Link>

          <Link to="/recipes" className="secondary-link">
            My Recipes
          </Link>
        </div>

        {message && <p className="nutrition-message">{message}</p>}
      </section>

      <section className="nutrition-layout">
        <NutritionCalculator
          onCalculate={handleCalculate}
          initialFormData={formData}
        />

        <NutritionSummary
          results={results}
          onSave={handleSaveTargets}
          isSaving={isSaving}
          hasCalculated={hasCalculated}
        />
      </section>
    </main>
  );
}

export default NutritionHome;