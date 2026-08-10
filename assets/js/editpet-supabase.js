const token = PawTagRoute.secretToken();

function showUnauthorized() {
  document.body.innerHTML = `
    <main style="padding:60px;text-align:center">
      <h1>404</h1>
      <h2>Access Link Tidak Valid</h2>
      <p>Link edit salah, tidak valid, atau tag belum diklaim.</p>
    </main>
  `;
}

async function loadEditablePet() {
  if (!token) return showUnauthorized();

  const response = await fetch(
    `${PAWTAG_CONFIG.FUNCTIONS_URL}/edit-by-token?token=${encodeURIComponent(token)}`
  );

  const result = await response.json();

  if (!response.ok) return showUnauthorized();

  window.PAWTAG_EDIT_PET = result.pet;
  window.dispatchEvent(new CustomEvent("pawtag:edit-pet-loaded", {
    detail: result.pet
  }));
}

async function saveEditablePet(updates) {
  const response = await fetch(
    `${PAWTAG_CONFIG.FUNCTIONS_URL}/edit-by-token`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...updates })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Gagal menyimpan data.");
  }

  return result.pet;
}

window.PawTagEdit = {
  token,
  load: loadEditablePet,
  save: saveEditablePet
};

loadEditablePet();
