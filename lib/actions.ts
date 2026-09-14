import { createClient } from "@/lib/supabase/client";

export async function logHabit(habit: { habit_id: string; title: string; category: string; co2_saved_kg: number }) {
  const supabase = createClient();
  
  // Get current authenticated user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Insert habit into Supabase database
  const { data, error } = await supabase.from("user_habits").insert([
    {
      user_id: user.id,
      habit_id: habit.habit_id,
      title: habit.title,
      category: habit.category,
      co2_saved_kg: habit.co2_saved_kg,
    },
  ]);

  if (error) {
    console.error("Error logging habit:", error.message);
    return null;
  }

  return data;
}
