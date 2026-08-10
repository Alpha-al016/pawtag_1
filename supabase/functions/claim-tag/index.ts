import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, corsHeaders);

  try {
    const body = await req.json();
    const {
      tag_id, owner_email, owner, phone, address,
      name, type, breed, birth, gender, color, weight, note, photo
    } = body;

    if (!tag_id || !owner_email || !owner || !name || !phone) {
      return json({ error: "Data wajib belum lengkap" }, 400, corsHeaders);
    }

    const secretToken = crypto.randomUUID();

    const { data, error } = await supabase
      .from("pets")
      .update({
        secret_token: secretToken,
        is_claimed: true,
        owner_email: String(owner_email).trim().toLowerCase(),
        owner, phone, address, name, type, breed, birth, gender, color, weight, note, photo
      })
      .eq("tag_id", String(tag_id).trim())
      .eq("is_claimed", false)
      .select("id, tag_id, is_claimed, owner_email")
      .maybeSingle();

    if (error) return json({ error: error.message }, 500, corsHeaders);
    if (!data) {
      return json({ error: "Tag tidak ditemukan atau sudah diklaim." }, 409, corsHeaders);
    }

    const site = Deno.env.get("PUBLIC_SITE_URL");
    const editUrl = `${site}/edit/${secretToken}`;

    // Email provider integration intentionally left behind a small adapter.
    // Set EMAIL_PROVIDER_URL/EMAIL_PROVIDER_API_KEY if you want to wire a provider.
    // Do not return secretToken to public pages; this response is only for the claim flow.
    return json({
      success: true,
      message: "Tag berhasil diklaim.",
      edit_url: editUrl,
      email: data.owner_email
    }, 200, corsHeaders);
  } catch {
    return json({ error: "Request tidak valid." }, 400, corsHeaders);
  }
});
