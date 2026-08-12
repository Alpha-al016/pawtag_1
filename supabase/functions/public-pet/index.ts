import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const tagId = url.searchParams.get("tag_id")?.trim();

  if (!tagId) {
    return json(
      {
        success: false,
        error: "tag_id wajib diisi",
      },
      400,
      corsHeaders,
    );
  }

  const { data: pet, error } = await supabase
    .from("pets")
    .select(`
      id,
      created_at,
      name,
      species,
      breed,
      contact_number,
      address,
      notes,
      tag_id,
      is_claimed
    `)
    .eq("tag_id", tagId)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);

    return json(
      {
        success: false,
        error: "DATABASE_ERROR",
      },
      500,
      corsHeaders,
    );
  }

  if (!pet) {
    return json(
      {
        success: false,
        error: "TAG_NOT_FOUND",
      },
      404,
      corsHeaders,
    );
  }

  return json(
    {
      success: true,
      function_version: "public-pet-v2",
      claimed: pet.is_claimed,
      pet,
    },
    200,
    corsHeaders,
  );
});