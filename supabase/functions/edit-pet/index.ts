import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {

  // ========================================
  // CORS
  // ========================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }


  // ========================================
  // GET
  // ========================================

  if (req.method === "GET") {

    const url = new URL(req.url);

    const secretToken =
      url.searchParams
        .get("secret_token")
        ?.trim();


    if (!secretToken) {
      return json(
        {
          success: false,
          error: "SECRET_TOKEN_REQUIRED",
        },
        400,
        corsHeaders
      );
    }


    const {
      data: pet,
      error,
    } = await supabase

      .from("pets")

      .select(`
        id,
        name,
        species,
        breed,
        contact_number,
        address,
        notes,
        tag_id,
        is_claimed
      `)

      .eq(
        "secret_token",
        secretToken
      )

      .maybeSingle();


    if (error) {
      return json(
        {
          success: false,
          error: error.message,
        },
        500,
        corsHeaders
      );
    }


    if (!pet) {
      return json(
        {
          success: false,
          error: "INVALID_TOKEN",
        },
        404,
        corsHeaders
      );
    }


    return json(
      {
        success: true,
        pet,
      },
      200,
      corsHeaders
    );
  }


  // ========================================
  // PUT
  // ========================================

  if (req.method === "PUT") {

    try {

      const body =
        await req.json();


      const {
        secret_token,
        name,
        species,
        breed,
        contact_number,
        address,
        notes,
      } = body;


      // ====================================
      // VALIDASI TOKEN
      // ====================================

      if (!secret_token) {

        return json(
          {
            success: false,
            error: "SECRET_TOKEN_REQUIRED",
          },
          400,
          corsHeaders
        );

      }


      // ====================================
      // VALIDASI DATA
      // ====================================

      if (
        !name ||
        !species ||
        !contact_number
      ) {

        return json(
          {
            success: false,
            error:
              "name, species, dan contact_number wajib diisi",
          },
          400,
          corsHeaders
        );

      }


      // ====================================
      // CARI PET
      // ====================================

      const {
        data: existingPet,
        error: findError,
      } = await supabase

        .from("pets")

        .select(`
          id,
          tag_id,
          secret_token
        `)

        .eq(
          "secret_token",
          secret_token.trim()
        )

        .maybeSingle();


      if (findError) {

        return json(
          {
            success: false,
            error: findError.message,
          },
          500,
          corsHeaders
        );

      }


      if (!existingPet) {

        return json(
          {
            success: false,
            error: "INVALID_TOKEN",
          },
          404,
          corsHeaders
        );

      }


      // ====================================
      // UPDATE
      // ====================================

      const {
        data: updatedPet,
        error: updateError,
      } = await supabase

        .from("pets")

        .update({
          name: name.trim(),
          species: species.trim(),
          breed: breed?.trim() || null,
          contact_number:
            contact_number.trim(),
          address:
            address?.trim() || null,
          notes:
            notes?.trim() || null,
        })

        .eq(
          "id",
          existingPet.id
        )

        .select(`
          id,
          name,
          species,
          breed,
          contact_number,
          address,
          notes,
          tag_id,
          is_claimed
        `)

        .single();


      if (updateError) {

        return json(
          {
            success: false,
            error: updateError.message,
          },
          500,
          corsHeaders
        );

      }


      // ====================================
      // SUCCESS
      // ====================================

      return json(
        {
          success: true,
          pet: updatedPet,
        },
        200,
        corsHeaders
      );


    } catch (_error) {

      return json(
        {
          success: false,
          error: "INVALID_REQUEST",
        },
        400,
        corsHeaders
      );

    }

  }


  // ========================================
  // METHOD TIDAK DIDUKUNG
  // ========================================

  return json(
    {
      success: false,
      error: "METHOD_NOT_ALLOWED",
    },
    405,
    corsHeaders
  );

});