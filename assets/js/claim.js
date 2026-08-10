const tagId = PawTagRoute.tagId();
const form = document.getElementById("claimForm");
const statusEl = document.getElementById("status");

if (!tagId) {
  statusEl.textContent = "Tag tidak valid.";
  form.style.display = "none";
} else {
  document.getElementById("tag_id").value = tagId;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Memproses...";

  const value = (id) => document.getElementById(id).value.trim();

  const body = {
    tag_id: tagId,
    owner_email: value("owner_email"),
    owner: value("owner"),
    phone: value("phone"),
    address: value("address"),
    name: value("name"),
    type: value("type"),
    breed: value("breed"),
    birth: value("birth"),
    gender: value("gender"),
    color: value("color"),
    weight: document.getElementById("weight").value || null,
    note: document.getElementById("note").value.trim()
  };

  try {
    const response = await fetch(
      `${PAWTAG_CONFIG.FUNCTIONS_URL}/claim-tag`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      statusEl.textContent = result.error || "Gagal mengklaim tag.";
      return;
    }

    statusEl.textContent =
      "Tag berhasil diklaim. Link akses edit telah disiapkan untuk dikirim ke email Anda.";

    form.reset();
    document.getElementById("tag_id").value = tagId;
  } catch {
    statusEl.textContent = "Tidak dapat terhubung ke server.";
  }
});
