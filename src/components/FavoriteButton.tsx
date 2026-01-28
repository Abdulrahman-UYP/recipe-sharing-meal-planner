import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";

interface FavoriteButtonProps {
    recipeId: string;
    className?: string;
    variant?: "icon" | "full";
}

export function FavoriteButton({ recipeId, className, variant = "icon" }: FavoriteButtonProps) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkFavoriteStatus();
        }
    }, [user, recipeId]);

    const checkFavoriteStatus = async () => {
        const { data } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user!.id)
            .eq('recipe_id', recipeId)
            .single();

        setIsFavorite(!!data);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a card
        if (!user) return; // Optionally redirect to login

        setLoading(true);
        if (isFavorite) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('recipe_id', recipeId);

            if (!error) setIsFavorite(false);
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: user.id, recipe_id: recipeId });

            if (!error) setIsFavorite(true);
        }
        setLoading(false);
    };

    if (!user) return null;

    if (variant === "full") {
        return (
            <Button
                variant={isFavorite ? "secondary" : "outline"}
                onClick={toggleFavorite}
                disabled={loading}
                className={className}
            >
                <Heart className={cn("mr-2 h-4 w-4", isFavorite && "fill-current text-red-500")} />
                {isFavorite ? "Saved" : "Save to Favorites"}
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full bg-background/80 hover:bg-background shadow-sm backdrop-blur-sm", className)}
            onClick={toggleFavorite}
            disabled={loading}
        >
            <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </Button>
    );
}
