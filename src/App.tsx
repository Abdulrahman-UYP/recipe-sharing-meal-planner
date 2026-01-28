import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateRecipe } from "./pages/CreateRecipe";
import { Recipes } from "./pages/Recipes";
import { RecipeDetail } from "./pages/RecipeDetail";

// Placeholder components for routes we haven't built yet
import { MealPlanner } from "./pages/MealPlanner";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create-recipe" element={<CreateRecipe />} />
              <Route path="/planner" element={<MealPlanner />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
