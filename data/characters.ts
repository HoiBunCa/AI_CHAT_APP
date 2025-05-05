import { supabase } from "@/lib/supabase";

export interface Character {
  id: string;
  name: string;
  personality: string;
  imageUrl: string;
  color: string;
  description: string;
  isLocked?: boolean;
  systemPrompt: string;
  category: string;
}

export async function getCharacterById(id: string): Promise<Character | undefined> {
  const { data, error } = await supabase
    .from('CHARACTERS')
    .select('*')
    .eq('id', id)
    .single(); // Lấy đúng 1 record
  console.log(data);
  if (error) {
    console.error("Error fetching character by ID:", error);
    return undefined;
  }

  return data as Character;
}


export async function fetchCharacters(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('CHARACTERS')
    .select('*').order('id');
  
  if (error) {
    console.error("Error fetching characters:", error);
    return [];
  }

  return data as Character[];
}