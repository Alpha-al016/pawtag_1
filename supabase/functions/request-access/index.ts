import { corsHeaders } from "../_shared/cors.ts";
import { supabase, json } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, corsHeaders);

  try {
    const { email } = await req.json();
    const normalized = String(email ?? "").trim().toLowerCase();

    // Always return the same message to prevent email enumeration.
    const message = "Jika email terdaftar, link akses akan dikirim.";

    if (!normalized) return json({ message }, 200, corsHeaders);

    const { data: pets, error } = await supabase
      .from("pets")
      .select("name, secret_token")
      .eq("owner_email", normalized)
      .eq("is_claimed", true);

    if (error) {
      console.error(error);
      return json({ message }, 200, corsHeaders);
    }

    const links = (pets ?? []).map((pet) => ({
      name: pet.name,
      url: `${Deno.env.get("PUBLIC_SITE_URL")}/edit/${pet.secret_token}`
    }));

    // TODO: Send `links` through your transactional email provider.
    // Never return the links to the browser.

    console.log("Access links prepared for email:", {
      recipient: normalized,
      count: links.length
    });

    return json({ message }, 200, corsHeaders);
  } catch {
    return json({
      message: "Jika email terdaftar, link akses akan dikirim."
    }, 200, corsHeaders);
  }
});
