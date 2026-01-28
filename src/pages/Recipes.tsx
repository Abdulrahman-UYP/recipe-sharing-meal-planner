import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";
import { RecipeCard } from "../components/RecipeCard";
import { Input } from "../components/ui/Input";
import { Loader2, Search } from "lucide-react";
import { Button } from "../components/ui/Button";

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('recipes')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setRecipes(data);
        setLoading(false);
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? recipe.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Vegan", "Vegetarian"];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Discover Recipes</h1>
                    <p className="text-muted-foreground">Find your next meal inspiration.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search recipes..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={categoryFilter === null ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(null)}
                >
                    All
                </Button>
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={categoryFilter === cat ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            <p className="text-lg font-medium">No recipes found.</p>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
