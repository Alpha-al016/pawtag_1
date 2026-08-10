import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const tagId = new URL(req.url).searchParams.get("tag_id")?.trim();

  if (!tagId) return json({ error: "tag_id wajib diisi" }, 400, corsHeaders);

  const { data: pet, error } = await supabase
    .from("pets")
    .select(`
      id, tag_id, is_claimed,
      name, type, breed, birth, gender, color, weight,
      owner, phone, address, note, photo
    `)
    .eq("tag_id", tagId)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500, corsHeaders);
  if (!pet) return json({ error: "Tag tidak ditemukan" }, 404, corsHeaders);

  return json({ claimed: pet.is_claimed, pet }, 200, corsHeaders);
});
