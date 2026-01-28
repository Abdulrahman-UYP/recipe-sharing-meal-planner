import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { RecipeCard } from "../components/RecipeCard";
import type { Database } from "../types/supabase";
import { Loader2, ChefHat, Heart, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"recipes" | "favorites">("recipes");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserContent();
        }
    }, [user, activeTab]);

    const fetchUserContent = async () => {
        setLoading(true);
        if (!user) return;

        if (activeTab === "recipes") {
            const { data } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (data) setRecipes(data);
        } else {
            // Check if favorite relation works
            const { data } = await supabase
                .from('favorites')
                .select('recipes(*)')
                .eq('user_id', user.id);

            if (data) {
                const validRecipes = data.map((f: any) => f.recipes).filter(Boolean);
                setFavorites(validRecipes);
            }
        }
        setLoading(false);
    };

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl">🧑‍🍳</span>
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-2xl font-bold">{user.user_metadata.full_name || "Chef"}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/create-recipe">
                        <Button>
                            <ChefHat className="mr-2 h-4 w-4" /> Share Recipe
                        </Button>
                    </Link>
                    <Link to="/planner">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" /> Go to Planner
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "recipes" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setActiveTab("recipes")}
                    >
                        My Recipes
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "favorites" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setActiveTab("favorites")}
                    >
                        Favorites
                    </button>
                </div>

                {loading ? (
                    <div className="flex h-32 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {activeTab === "recipes" && (
                            recipes.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {recipes.map(recipe => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border rounded-lg border-dashed">
                                    <h3 className="text-lg font-medium">No recipes yet</h3>
                                    <p className="text-muted-foreground mb-4">Start sharing your culinary creations.</p>
                                    <Link to="/create-recipe"><Button>Share First Recipe</Button></Link>
                                </div>
                            )
                        )}

                        {activeTab === "favorites" && (
                            favorites.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {favorites.map(recipe => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border rounded-lg border-dashed">
                                    <Heart className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                                    <h3 className="text-lg font-medium">No favorites yet</h3>
                                    <p className="text-muted-foreground">Save recipes you like to find them here.</p>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
