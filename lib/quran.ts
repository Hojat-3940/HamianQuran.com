
import { supabase } from "./supabase";

export async function getSurahVerses(
  surahNumber: number
) {
  const { data, error } = await supabase
    .from("quran_verses")
    .select(
      "id, surah_number, ayah_number, arabic_text"
    )
    .eq("surah_number", surahNumber)
    .order("ayah_number", { ascending: true });

  if (error) {
    console.error("Quran loading error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}
