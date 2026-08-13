import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json(
      { success: false, error: "Method not allowed" },
      405,
      corsHeaders
    );
  }

  try {
    const body = await req.json();
    const tagId = body.tag_id?.trim();

    if (!tagId) {
      return json(
        { success: false, error: "tag_id wajib diisi" },
        400,
        corsHeaders
      );
    }

    // 1. Cari hewan berdasarkan tag_id
    const { data: pet, error: petError } = await supabase
      .from("pets")
      .select("id, tag_id")
      .eq("tag_id", tagId)
      .maybeSingle();

    if (petError) {
      console.error("PET FETCH ERROR:", petError);
      return json(
        { success: false, error: petError.message },
        500,
        corsHeaders
      );
    }

    if (!pet) {
      return json(
        { success: false, error: "TAG_NOT_FOUND" },
        404,
        corsHeaders
      );
    }

    // 2. Simpan riwayat scan ke tabel scan_history
    const { error: insertError } = await supabase
      .from("scan_history")
      .insert({
        tag_id: pet.tag_id,
        pet_id: pet.id, // Pastikan pet_id di tabel scan_history menerima UUID
      });

    if (insertError) {
      console.error("INSERT ERROR DETAIL:", insertError);
      return json(
        { success: false, error: insertError.message },
        500,
        corsHeaders
      );
    }

    return json(
      { success: true, message: "Scan recorded successfully" },
      200,
      corsHeaders
    );

  } catch (error) {
    console.error("RECORD SCAN ERROR:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      500,
      corsHeaders
    );
  }
});