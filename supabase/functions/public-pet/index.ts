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
      owner_name,
      contact_number,
      address,
      notes,
      tag_id,
      is_claimed,
      photo_url
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

  let _photoUrl = null;

if (pet.photo_url) {

    const {
        data: signedUrlData,
        error: signedUrlError
    } = await supabase.storage
        .from("pet-images")
        .createSignedUrl(
            pet.photo_url,
            60 * 60
        );

    if (signedUrlError) {

        console.error(
            "SIGNED URL ERROR:",
            signedUrlError
        );

    } else {

        _photoUrl =
            signedUrlData?.signedUrl || null;

    }
}

// ============================================
// RESPONSE
// ============================================

return json(
    {
        success: true,

        claimed: true,

        pet: {
            ...pet,

            photo_url:
                _photoUrl
        }
    },
    200,
    corsHeaders
);
});