import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { ChefHat, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                        <ChefHat className="h-6 w-6" />
                        <span>RecipeShare</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/recipes" className="text-sm font-medium transition-colors hover:text-primary">
                            Discover
                        </Link>
                        {user ? (
                            <>
                                <Link to="/planner" className="text-sm font-medium transition-colors hover:text-primary">
                                    Meal Planner
                                </Link>
                                <Link to="/create-recipe" className="text-sm font-medium transition-colors hover:text-primary">
                                    Share Recipe
                                </Link>
                                <div className="flex items-center gap-4 ml-4">
                                    <Link to="/profile">
                                        <Button variant="ghost" size="icon" title="Profile">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Log In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t p-4 space-y-4 bg-background">
                        <Link to="/recipes" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Discover</Link>
                        {user ? (
                            <>
                                <Link to="/planner" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Meal Planner</Link>
                                <Link to="/create-recipe" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Share Recipe</Link>
                                <Link to="/profile" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                <Button variant="outline" className="w-full justify-start" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" className="w-full justify-start">Log In</Button></Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)}><Button className="w-full justify-start">Sign Up</Button></Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
