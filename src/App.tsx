import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Navbar from "./components/Navbar";
import CreateRecipe from "./pages/CreateRecipe";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;