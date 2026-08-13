import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {

    // ========================================
    // CORS
    // ========================================

    if (req.method === "OPTIONS") {

        return new Response(
            "ok",
            {
                headers: corsHeaders
            }
        );

    }


    // ========================================
    // METHOD
    // ========================================

    if (req.method !== "POST") {

        return json(
            {
                success: false,
                error: "Method not allowed"
            },
            405,
            corsHeaders
        );

    }


    try {

        // ====================================
        // FORM DATA
        // ====================================

        const formData =
            await req.formData();


        const secretToken =
            formData
                .get("secret_token")
                ?.toString()
                .trim();


        const file =
            formData.get("photo");


        // ====================================
        // VALIDASI TOKEN
        // ====================================

        if (!secretToken) {

            return json(
                {
                    success: false,
                    error: "SECRET_TOKEN_REQUIRED"
                },
                400,
                corsHeaders
            );

        }


        // ====================================
        // VALIDASI FILE
        // ====================================

        if (!(file instanceof File)) {

            return json(
                {
                    success: false,
                    error: "PHOTO_REQUIRED"
                },
                400,
                corsHeaders
            );

        }


        // ====================================
        // VALIDASI TYPE
        // ====================================

        if (!file.type.startsWith("image/")) {

            return json(
                {
                    success: false,
                    error: "INVALID_IMAGE_TYPE"
                },
                400,
                corsHeaders
            );

        }


        // ====================================
        // CARI PET
        // ====================================

        const {
            data: pet,
            error: petError
        } = await supabase

            .from("pets")

            .select(
                "id, tag_id, photo_url"
            )

            .eq(
                "secret_token",
                secretToken
            )

            .maybeSingle();


        if (petError) {

            console.error(
                "PET FETCH ERROR:",
                petError
            );

            return json(
                {
                    success: false,
                    error: petError.message
                },
                500,
                corsHeaders
            );

        }


        if (!pet) {

            return json(
                {
                    success: false,
                    error: "INVALID_SECRET_TOKEN"
                },
                401,
                corsHeaders
            );

        }


        // ====================================
        // NAMA FILE
        // ====================================

        const fileExt =
            file.name
                ?.split(".")
                .pop()
                ?.toLowerCase() ||
            "jpg";


        const filePath =
            `${pet.id}.${fileExt}`;


        // ====================================
        // UPLOAD STORAGE
        // ====================================

        const {
            error: uploadError
        } = await supabase.storage

            .from("pet-images")

            .upload(
                filePath,
                file,
                {
                    contentType:
                        file.type,

                    upsert:
                        true
                }
            );


        if (uploadError) {

            console.error(
                "STORAGE UPLOAD ERROR:",
                uploadError
            );

            return json(
                {
                    success: false,
                    error:
                        uploadError.message
                },
                500,
                corsHeaders
            );

        }


        // ====================================
        // SIMPAN PATH
        // ====================================

        const {
            error: updateError
        } = await supabase

            .from("pets")

            .update({
                photo_url:
                    filePath
            })

            .eq(
                "id",
                pet.id
            );


        if (updateError) {

            console.error(
                "PHOTO PATH UPDATE ERROR:",
                updateError
            );

            return json(
                {
                    success: false,
                    error:
                        updateError.message
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

                photo_path:
                    filePath
            },
            200,
            corsHeaders
        );


    } catch (error) {

        console.error(
            "UPLOAD PET PHOTO ERROR:",
            error
        );


        return json(
            {
                success: false,

                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error"
            },
            500,
            corsHeaders
        );

    }

});