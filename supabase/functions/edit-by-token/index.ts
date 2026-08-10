import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

const fields = `
  id, tag_id,
  name, type, breed, birth, gender, color, weight,
  owner, phone, address, note, photo
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method === "GET") {
    const token = new URL(req.url).searchParams.get("token")?.trim();
    if (!token) return json({ error: "Unauthorized" }, 401, corsHeaders);

    const { data: pet, error } = await supabase
      .from("pets")
      .select(fields)
      .eq("secret_token", token)
      .eq("is_claimed", true)
      .maybeSingle();

    if (error) return json({ error: error.message }, 500, corsHeaders);
    if (!pet) return json({ error: "Token tidak valid" }, 404, corsHeaders);

    return json({ pet }, 200, corsHeaders);
  }

  if (req.method === "PUT") {
    try {
      const body = await req.json();
      const { token, ...updates } = body;

      if (!token) return json({ error: "Unauthorized" }, 401, corsHeaders);

      // Allow-list editable fields; token, tag_id, owner_email, is_claimed cannot be changed here.
      const allowed = [
        "name", "type", "breed", "birth", "gender", "color",
        "weight", "owner", "phone", "address", "note", "photo"
      ];

      const clean: Record<string, unknown> = {};
      for (const key of allowed) if (key in updates) clean[key] = updates[key];

      const { data, error } = await supabase
        .from("pets")
        .update(clean)
        .eq("secret_token", token)
        .eq("is_claimed", true)
        .select(fields)
        .maybeSingle();

      if (error) return json({ error: error.message }, 500, corsHeaders);
      if (!data) return json({ error: "Token tidak valid" }, 404, corsHeaders);

      return json({ success: true, pet: data }, 200, corsHeaders);
    } catch {
      return json({ error: "Request tidak valid." }, 400, corsHeaders);
    }
  }

  return json({ error: "Method not allowed" }, 405, corsHeaders);
});
