const tagId = PawTagRoute.tagId();

function showError(message) {
  document.body.innerHTML = `
    <main style="padding:40px;text-align:center">
      <h1>Tag tidak ditemukan</h1>
      <p>${message}</p>
    </main>
  `;
}

async function loadPublicPet() {
  if (!tagId) return showError("Tag ID tidak valid.");

  const response = await fetch(
    `${PAWTAG_CONFIG.FUNCTIONS_URL}/public-pet?tag_id=${encodeURIComponent(tagId)}`
  );

  const result = await response.json();

  if (!response.ok) return showError(result.error || "Data tidak ditemukan.");

  if (!result.claimed) {
    window.location.replace(`/claim/${encodeURIComponent(tagId)}`);
    return;
  }

  // The existing public page can bind its own UI to these values.
  // Expose only public-safe data; secret_token is never returned.
  window.PAWTAG_PUBLIC_PET = result.pet;
  window.dispatchEvent(new CustomEvent("pawtag:pet-loaded", {
    detail: result.pet
  }));
}

loadPublicPet();
