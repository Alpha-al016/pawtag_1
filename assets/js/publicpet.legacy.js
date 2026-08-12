// ============================================
// PAWTAG - PUBLIC PET
// ============================================

const FUNCTIONS_URL =
  window.PAWTAG_CONFIG?.FUNCTIONS_URL;

if (!FUNCTIONS_URL) {
  console.error("PAWTAG_CONFIG belum tersedia.");

  alert("Konfigurasi aplikasi tidak ditemukan.");
}

// ============================================
// Ambil TAG ID dari URL
// ============================================

function getTagIdFromUrl() {
  const path =
    window.location.pathname;

  const parts =
    path.split("/").filter(Boolean);

  // ========================================
  // FORMAT BARU
  // /p/PT-001
  // ========================================

  if (
    parts.length >= 2 &&
    parts[0] === "p"
  ) {
    return decodeURIComponent(parts[1]);
  }

  // ========================================
  // FORMAT LAMA / TESTING
  // ?code=PT-001
  // ========================================

  const params =
    new URLSearchParams(
      window.location.search
    );

  const code =
    params.get("code");

  if (code) {
    return code.trim();
  }

  return null;
}

// ============================================
// Tampilkan Error
// ============================================

function showError(message) {
  console.error(message);

  const petName = document.getElementById("petName");

  if (petName) {
    petName.textContent = message;
  }
}

// ============================================
// Ambil Data dari Supabase
// ============================================

async function loadPublicPet() {
  const tagId = getTagIdFromUrl();

  if (!tagId) {
    showError("Tag NFC tidak valid.");
    return;
  }

  console.log("Tag ID:", tagId);

  try {
    const response = await fetch(
      `${FUNCTIONS_URL}/public-pet?tag_id=${encodeURIComponent(tagId)}`
    );

    const result = await response.json();

    console.log("Public Pet API:", result);

    // ========================================
    // Tag tidak ditemukan
    // ========================================

    if (response.status === 404) {
      showError("Tag NFC tidak ditemukan.");
      return;
    }

    // ========================================
    // Error API
    // ========================================

    if (!response.ok || !result.success) {
      showError("Gagal mengambil data hewan.");
      return;
    }

    // ========================================
    // TAG BELUM DIKLAIM
    // ========================================

    if (result.claimed === false) {
      window.location.href =
        `/claim/${encodeURIComponent(tagId)}`;

      return;
    }

    // ========================================
    // TAG SUDAH DIKLAIM
    // ========================================

    const pet = result.pet;

    if (!pet) {
      showError("Data hewan tidak tersedia.");
      return;
    }

    // ========================================
    // Tampilkan Data Hewan
    // ========================================

    const petName =
      document.getElementById("petName");

    const petBreed =
      document.getElementById("petBreed");

    const ownerPhone =
      document.getElementById("ownerPhone");

    const ownerAddress =
      document.getElementById("ownerAddress");

    const petNote =
      document.getElementById("petNote");

    const petStatus =
      document.getElementById("petStatus");

    // Nama
    if (petName) {
      petName.textContent =
        pet.name || "Nama tidak tersedia";
    }

    // Breed
    if (petBreed) {
      petBreed.textContent =
        pet.breed || "Tidak diketahui";
    }

    // Status NFC
    if (petStatus) {
      petStatus.textContent =
        "🟢 NFC Aktif";
    }

    // ========================================
    // Data Kontak
    // ========================================

    if (ownerPhone) {
      ownerPhone.textContent =
        pet.contact_number || "Tidak tersedia";
    }

    if (ownerAddress) {
      ownerAddress.textContent =
        pet.address || "Tidak tersedia";
    }

    // ========================================
    // Catatan
    // ========================================

    if (petNote) {
      petNote.textContent =
        pet.notes || "Tidak ada catatan.";
    }

    // ========================================
    // Tombol Telepon
    // ========================================

    const callBtn =
      document.getElementById("callBtn");

    if (callBtn && pet.contact_number) {
      callBtn.href =
        `tel:${pet.contact_number}`;
    }

    // ========================================
    // Tombol WhatsApp
    // ========================================

    const waBtn =
      document.getElementById("waBtn");

    if (waBtn && pet.contact_number) {
      const phone =
        pet.contact_number.replace(/^0/, "62");

      const message =
        `Halo, saya menemukan ${pet.name || "hewan Anda"}.`;

      waBtn.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
  } catch (error) {
    console.error(
      "Gagal menghubungi Public Pet API:",
      error
    );

    showError(
      "Tidak dapat terhubung ke server."
    );
  }
}

// ============================================
// Jalankan
// ============================================

loadPublicPet();