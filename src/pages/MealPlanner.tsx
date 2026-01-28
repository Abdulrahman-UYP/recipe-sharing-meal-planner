import { useState, useEffect } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Database } from "../types/supabase";
import { Button } from "../components/ui/Button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "../components/ui/Input";

type MealPlan = Database['public']['Tables']['meal_plans']['Row'] & {
    recipes?: { title: string, id: string } | null
};

export function MealPlanner() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekMeals, setWeekMeals] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingMeal, setAddingMeal] = useState<{ day: Date, type: string } | null>(null);
    const [mealTitle, setMealTitle] = useState("");

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    useEffect(() => {
        if (user) fetchWeekMeals();
    }, [user, currentDate]);

    const fetchWeekMeals = async () => {
        setLoading(true);
        const start = weekDays[0].toISOString();
        const end = weekDays[6].toISOString();

        const { data } = await supabase
            .from('meal_plans')
            .select('*, recipes(title, id)')
            .eq('user_id', user!.id)
            .gte('date', start)
            .lte('date', end);

        if (data) setWeekMeals(data as any);
        setLoading(false);
    };

    const handleAddMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingMeal || !user) return;

        const { error } = await supabase.from('meal_plans').insert({
            user_id: user.id,
            date: format(addingMeal.day, 'yyyy-MM-dd'),
            meal_type: addingMeal.type,
            title: mealTitle,
        });

        if (!error) {
            setAddingMeal(null);
            setMealTitle("");
            fetchWeekMeals();
        }
    };

    const handleDeleteMeal = async (id: string) => {
        if (!confirm("Remove this meal?")) return;
        await supabase.from('meal_plans').delete().eq('id', id);
        fetchWeekMeals();
    };

    const mealTypes = ["Breakfast", "Lunch", "Dinner"];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Planner</h1>
                    <p className="text-muted-foreground">{format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, -7))}>Previous Week</Button>
                    <Button variant="outline" onClick={() => setCurrentDate(addDays(currentDate, 7))}>Next Week</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-7 overflow-x-auto">
                    {weekDays.map((day) => {
                        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                            <div key={day.toISOString()} className={`flex flex-col gap-2 rounded-lg border p-4 min-w-[200px] md:min-w-0 ${isToday ? 'bg-accent/50 border-primary/50' : 'bg-card'}`}>
                                <div className="text-center mb-2">
                                    <p className="font-semibold text-sm">{format(day, "EEEE")}</p>
                                    <p className="text-muted-foreground text-xs">{format(day, "MMM d")}</p>
                                </div>

                                {mealTypes.map(type => {
                                    const mealsForSlot = weekMeals.filter(m =>
                                        m.date === format(day, 'yyyy-MM-dd') && m.meal_type === type
                                    );

                                    return (
                                        <div key={type} className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{type}</span>

                                            {mealsForSlot.map(meal => (
                                                <div key={meal.id} className="group relative rounded border bg-background p-2 text-sm shadow-sm hover:shadow-md transition-shadow">
                                                    <p className="font-medium line-clamp-2 text-xs">{meal.recipes?.title || meal.title}</p>
                                                    <button
                                                        onClick={() => handleDeleteMeal(meal.id)}
                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-destructive p-0.5 rounded hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {addingMeal?.day === day && addingMeal?.type === type ? (
                                                <form onSubmit={handleAddMeal} className="mt-1">
                                                    <Input
                                                        autoFocus
                                                        className="h-7 text-xs px-2"
                                                        placeholder="Meal..."
                                                        value={mealTitle}
                                                        onChange={e => setMealTitle(e.target.value)}
                                                        onBlur={() => !mealTitle && setAddingMeal(null)}
                                                    />
                                                </form>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-full text-xs justify-start px-1 text-muted-foreground hover:text-primary"
                                                    onClick={() => setAddingMeal({ day, type })}
                                                >
                                                    <Plus className="mr-1 h-3 w-3" /> Add
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
