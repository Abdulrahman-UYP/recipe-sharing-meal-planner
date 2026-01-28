import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Save, Plus, X } from "lucide-react";

export function CreateRecipe() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Breakfast");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [instructions, setInstructions] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // Simplified for now, just text input or future upload
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            // Filter out empty ingredients
            const validIngredients = ingredients.filter(i => i.trim() !== "");

            const { error } = await supabase.from('recipes').insert({
                user_id: user.id,
                title,
                description,
                category,
                ingredients: validIngredients,
                instructions,
                image_url: imageUrl || null
            });

            if (error) throw error;
            navigate("/recipes");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Share a Recipe</h1>
                <p className="text-muted-foreground mt-2">
                    Share your culinary masterpieces with the community.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            required
                            placeholder="e.g. Grandma's Apple Pie"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="A brief description of your dish..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            {imageUrl && (
                                <div className="h-10 w-10 relative overflow-hidden rounded border">
                                    <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = "")} />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Paste a direct link to an image.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Dessert</option>
                                <option>Snack</option>
                                <option>Vegan</option>
                                <option>Vegetarian</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Ingredients</label>
                        <div className="space-y-2">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Ingredient ${index + 1}`}
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveIngredient(index)}
                                        disabled={ingredients.length === 1}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient} className="mt-2">
                                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Instructions</label>
                        <textarea
                            required
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Step-by-step cooking instructions..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Publish Recipe
                    </Button>
                </div>
            </form>
        </div>
    );
}
