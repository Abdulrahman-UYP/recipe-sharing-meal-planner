import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Master Your Kitchen with <span className="text-primary">RecipeShare</span>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
                Discover new recipes, organize your weekly meals, and join a community of food lovers.
                Simple, elegant, and designed for you.
            </p>
            <div className="flex gap-4">
                <Link to="/recipes">
                    <Button size="lg">Explore Recipes</Button>
                </Link>
                <Link to="/register">
                    <Button variant="outline" size="lg">Start Planning</Button>
                </Link>
            </div>
        </div>
    );
}
