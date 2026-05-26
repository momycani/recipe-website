import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./features/kitchen/pages/Recipes";
import CreateRecipe from "./features/kitchen/pages/CreateRecipe";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipeBank from "./features/kitchen/pages/RecipeBank";
import ImportRecipe from "./features/kitchen/pages/ImportRecipe";
import KitchenHome from "./features/kitchen/pages/KitchenHome.tsx";
import KitchenLayout from "./features/kitchen/KitchenLayout";
import NutritionHome from "./features/kitchen/nutrition/pages/NutritionHome";
import NutritionPage from "./features/kitchen/nutrition/pages/NutritionPage.tsx";
import FitnessPage from "./features/kitchen/nutrition/pages/FitnessPage.tsx";
import CanningHome from "./features/kitchen/canning/pages/CanningHome";
import SafeCanning from "./features/kitchen/canning/pages/SafeCanning";
import CreateCanningRecipe from "./features/kitchen/canning/pages/CreateCanningRecipe"
import PetsHome from "./features/kitchen/pets/pages/PetsHome";

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<KitchenLayout />}>
          <Route path="/kitchen" element={<KitchenHome />} />
         <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            }
          />
          <Route path="/recipe-bank" element={<RecipeBank />} />
          <Route
            path="/import-recipe"
            element={
              <ProtectedRoute>
                <ImportRecipe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-recipe"
            element={
              <ProtectedRoute>
                <CreateRecipe />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/edit-recipe/:id"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/nutrition-fitness" element={<NutritionHome />} />
        <Route path="/nutrition-fitness/nutrition" element={<NutritionPage />} />
        <Route path="/nutrition-fitness/fitness" element={<FitnessPage />} />
        <Route path="/canning" element={<CanningHome />} />
        <Route path="/canning/safe-canning" element={<SafeCanning />} />
        <Route path="/canning/create" element={<CreateCanningRecipe />} />
        <Route path="/pets" element={<PetsHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;