import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Loader2, ArrowLeft, Trash2, Edit } from "lucide-react";

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
    profiles: { full_name: string | null } | null
};

export function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        setLoading(true);
        // Note: We need to properly link to profiles if we want the author name, 
        // but for now let's just fetch the recipe to keep it simple with RLS.
        // If we want to join, we need to ensure the foreign key relationship is correctly set up in Types.
        // Assuming simple fetch for now.
        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            navigate("/recipes"); // Redirect if not found
        } else {
            setRecipe(data as any);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (!error) navigate("/recipes");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!recipe) return null;

    const isOwner = user?.id === recipe.user_id;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-3">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    {recipe.image_url ? (
                        <img src={recipe.image_url} alt={recipe.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No Image</div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-4">
                    <div>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {recipe.category || "Uncategorized"}
                        </span>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight lg:text-5xl">{recipe.title}</h1>
                    </div>

                    <p className="text-xl text-muted-foreground">{recipe.description}</p>

                    {isOwner && (
                        <div className="flex gap-2 pt-4">
                            <Button variant="outline" size="sm" disabled title="Editing coming soon">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="md:col-span-1 border rounded-lg p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                        {(recipe.ingredients as string[])?.map((ingredient, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                <span>{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Instructions</h2>
                    <div className="prose prose-stone dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap leading-7">{recipe.instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
