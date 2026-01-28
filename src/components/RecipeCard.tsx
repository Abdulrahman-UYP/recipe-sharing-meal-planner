import { Link } from "react-router-dom";
import { Clock, Users, Heart } from "lucide-react";
import { Database } from "../../types/supabase";

type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <Link to={`/recipes/${recipe.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {recipe.title}</span>
            </Link>

            <div className="aspect-video w-full overflow-hidden bg-muted">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {recipe.category || "Uncategorized"}
                    </span>
                </div>

                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">{recipe.title}</h3>
                <p className="line-clamp-2 mt-2 text-sm text-muted-foreground">
                    {recipe.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    {/* Placeholders for future data */}
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>30m</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>2</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
