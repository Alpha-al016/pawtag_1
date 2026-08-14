import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

const _RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const _APP_BASE_URL = Deno.env.get("APP_BASE_URL");

Deno.serve(async (req) => {

    // ========================================
    // CORS
    // ========================================

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
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
        // REQUEST BODY
        // ====================================

        const body = await req.json();

        const {
            tag_id,
            owner_email,
            owner_name,
            name,
            species,
            breed,
            contact_number,
            address,
            notes
        } = body;


        // ====================================
        // VALIDASI
        // ====================================

        if (
            !tag_id ||
            !owner_email ||
            !owner_name ||
            !name ||
            !species ||
            !contact_number
        ) {
            return json(
                {
                    success: false,
                    error: "tag_id, owner_email, owner_name, name, species, dan contact_number wajib diisi"
                },
                400,
                corsHeaders
            );
        }




        // ====================================
        // CARI TAG
        // ====================================

        const {
            data: pet,
            error: findError
        } = await supabase
            .from("pets")
            .select(`
                id,
                tag_id,
                is_claimed
            `)
            .eq("tag_id", tag_id.trim())
            .maybeSingle();


        // ====================================
        // ERROR QUERY
        // ====================================

        if (findError) {
            console.error("FIND TAG ERROR:", findError);
            return json(
                {
                    success: false,
                    error: "Gagal mencari tag"
                },
                500,
                corsHeaders
            );
        }


        // ====================================
        // TAG TIDAK DITEMUKAN
        // ====================================

        if (!pet) {
            return json(
                {
                    success: false,
                    error: "Tag tidak ditemukan"
                },
                404,
                corsHeaders
            );
        }


        // ====================================
        // SUDAH DIKLAIM
        // ====================================

        if (pet.is_claimed) {
            return json(
                {
                    success: false,
                    error: "Tag sudah diklaim"
                },
                409,
                corsHeaders
            );
        }


        // ====================================
        // GENERATE SECRET TOKEN
        // ====================================

        const secretToken = crypto.randomUUID();

        console.log("Generated token for tag:", pet.tag_id);


        // ====================================
        // UPDATE PET
        // ====================================

        const {
            data: updatedPet,
            error: updateError
        } = await supabase
            .from("pets")
            .update({
                owner_email: owner_email.trim(),
                owner_name: owner_name.trim(), // <--- Ditambahkan ke database
                name: name.trim(),
                species: species.trim(),
                breed: breed?.trim() || null,
                contact_number: contact_number.trim(),
                address: address?.trim() || null,
                notes: notes?.trim() || null,
                secret_token: secretToken,
                is_claimed: true
            })
            .eq("id", pet.id)
            .select(`
                id,
                tag_id,
                name,
                species,
                breed,
                contact_number,
                address,
                notes,
                owner_email,
                owner_name,
                is_claimed
            `)
            .single();


        // ====================================
        // UPDATE ERROR
        // ====================================

        if (updateError) {
            console.error("UPDATE ERROR:", updateError);
            return json(
                {
                    success: false,
                    error: "Gagal menyimpan data tag"
                },
                500,
                corsHeaders
            );
        }

        const _editUrl = `${_APP_BASE_URL}/pages/edit.html?secret_token=${secretToken}`;

        const _emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${_RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "PawTag <onboarding@resend.dev>",
                to: [owner_email.trim()],
                subject: "PawTag Anda Berhasil Diklaim",
                html: `
                    <h2>PawTag berhasil diklaim!</h2>
                    <p>Halo ${owner_name.trim()}, data hewan Anda sudah berhasil didaftarkan.</p>
                    <p>Gunakan link berikut untuk mengubah data PawTag:</p>
                    <p><a href="${_editUrl}">Edit Data PawTag</a></p>
                    <p>Simpan email ini karena link tersebut digunakan untuk mengakses data PawTag Anda.</p>
                `,
            }),
        });

        const emailResult = await _emailResponse.json();

        console.log("RESEND RESPONSE:", emailResult);

        if (!_emailResponse.ok) {
            console.error("EMAIL ERROR:", emailResult);
        }

        // ====================================
        // SUCCESS
        // ====================================

        return json(
            {
                success: true,
                message: "Tag berhasil diklaim",
                tag_id: updatedPet.tag_id
            },
            200,
            corsHeaders
        );

    } catch (error) {
        console.error("CLAIM TAG ERROR:", error);

        return json(
            {
                success: false,
                error: "Terjadi kesalahan pada server"
            },
            500,
            corsHeaders
        );
    }
});