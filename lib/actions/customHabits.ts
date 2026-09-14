import { createClient } from "@/lib/supabase/client";

export async function createCustomHabit(habit: {
  title: string;
  category: string;
  co2_saved_kg: number;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("custom_habits").insert([
    {
      user_id: user.id,
      title: habit.title,
      category: habit.category,
      co2_saved_kg: habit.co2_saved_kg,
    },
  ]);

  if (error) {
    console.error("Error creating custom habit:", error.message);
    return null;
  }
  return data;
}
