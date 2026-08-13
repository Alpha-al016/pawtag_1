// ============================================
// PAWTAG - PUBLIC PET V2
// ============================================

console.log("PAWTAG PUBLIC PET V2 LOADED");

// ============================================
// CONFIG
// ============================================

const FUNCTIONS_URL =
    window.PAWTAG_CONFIG?.FUNCTIONS_URL;

console.log("FUNCTIONS_URL:", FUNCTIONS_URL);


// ============================================
// Ambil TAG ID dari URL
// ============================================

function getTagIdFromUrl() {

    // ----------------------------------------
    // Format baru:
    // /p/PT-001
    // ----------------------------------------

    const path =
        window.location.pathname;

    const parts =
        path.split("/").filter(Boolean);

    if (
        parts.length >= 2 &&
        parts[0] === "p"
    ) {

        return decodeURIComponent(parts[1]);

    }


    // ----------------------------------------
    // Format lama untuk testing:
    // /pages/publicpet.html?code=PT-001
    // ----------------------------------------

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

    const petName =
        document.getElementById("petName");

    if (petName) {

        petName.textContent =
            message;

    }

}


// ============================================
// RECORD SCAN
// ============================================

async function recordScan(tagId) {

    try {

        const response =
            await fetch(
                `${FUNCTIONS_URL}/record-scan`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        tag_id: tagId
                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "RECORD SCAN API:",
            result
        );


        if (!response.ok) {

            console.error(
                "Gagal mencatat scan:",
                result
            );

            return;

        }


        console.log(
            "Scan berhasil dicatat."
        );

    }

    catch (error) {

        console.error(
            "RECORD SCAN ERROR:",
            error
        );

    }

}



// ============================================
// Load Public Pet
// ============================================

async function loadPublicPet() {

    const tagId =
        getTagIdFromUrl();

    console.log("TAG ID:", tagId);


    // ----------------------------------------
    // TAG ID tidak ditemukan
    // ----------------------------------------

    if (!tagId) {

        showError(
            "Tag NFC tidak valid."
        );

        return;

    }


    // ----------------------------------------
    // CONFIG tidak ditemukan
    // ----------------------------------------

    if (!FUNCTIONS_URL) {

        showError(
            "Konfigurasi server tidak ditemukan."
        );

        return;

    }


    try {

        // ------------------------------------
        // Request ke Supabase Edge Function
        // ------------------------------------

        const requestUrl =
            `${FUNCTIONS_URL}/public-pet?tag_id=${encodeURIComponent(tagId)}`;

        console.log(
            "REQUEST:",
            requestUrl
        );


        const response =
            await fetch(requestUrl);


        const result =
            await response.json();


        console.log(
            "PUBLIC PET API:",
            result
        );


        // ------------------------------------
        // TAG tidak ditemukan
        // ------------------------------------

        if (response.status === 404) {

            showError(
                "Tag NFC tidak ditemukan."
            );

            return;

        }


        // ------------------------------------
        // API Error
        // ------------------------------------

        if (
            !response.ok ||
            !result.success
        ) {

            showError(
                "Gagal mengambil data hewan."
            );

            return;

        }


        // ------------------------------------
        // TAG BELUM DIKLAIM
        // ------------------------------------

        if (result.claimed === false) {

            console.log(
                "Tag belum diklaim."
            );

            window.location.href =
                `/claim/${encodeURIComponent(tagId)}`;

            return;
        }


        // ------------------------------------
        // TAG SUDAH DIKLAIM
        // ------------------------------------

        const pet =
            result.pet;


        if (!pet) {

            showError(
                "Data hewan tidak tersedia."
            );

            return;

        }

        // ====================================
        // Catat Scan
        // ====================================

        await recordScan(tagId);


        console.log(
            "PET DATA:",
            pet
        );


        // ====================================
        // Nama Hewan
        // ====================================

        const petName =
            document.getElementById("petName");

        if (petName) {

            petName.textContent =
                pet.name ||
                "Nama tidak tersedia";

        }


        // ====================================
        // Breed
        // ====================================

        const petBreed =
            document.getElementById("petBreed");

        if (petBreed) {

            petBreed.textContent =
                pet.breed ||
                "Breed tidak diketahui";

        }


        // ====================================
        // Status NFC
        // ====================================

        const petStatus =
            document.getElementById("petStatus");

        if (petStatus) {

            petStatus.textContent =
                "🟢 NFC Aktif";

        }


        // ====================================
        // Nama Pemilik
        // ====================================

        const ownerName =
            document.getElementById("ownerName");

        if (ownerName) {

            // owner_name belum tersedia
            // di database baru.

            ownerName.textContent =
                "Pemilik";

        }


        // ====================================
        // Nomor Telepon
        // ====================================

        const ownerPhone =
            document.getElementById("ownerPhone");

        if (ownerPhone) {

            ownerPhone.textContent =
                pet.contact_number ||
                "Tidak tersedia";

        }


        // ====================================
        // Alamat
        // ====================================

        const ownerAddress =
            document.getElementById("ownerAddress");

        if (ownerAddress) {

            ownerAddress.textContent =
                pet.address ||
                "Tidak tersedia";

        }


        // ====================================
        // Catatan
        // ====================================

        const petNote =
            document.getElementById("petNote");

        if (petNote) {

            petNote.textContent =
                pet.notes ||
                "Tidak ada catatan.";

        }


        // ====================================
        // Tombol Telepon
        // ====================================

        const callBtn =
            document.getElementById("callBtn");

        if (
            callBtn &&
            pet.contact_number
        ) {

            callBtn.href =
                `tel:${pet.contact_number}`;

        }


        // ====================================
        // Tombol WhatsApp
        // ====================================

        const waBtn =
            document.getElementById("waBtn");


        if (
            waBtn &&
            pet.contact_number
        ) {

            const phone =
                pet.contact_number
                    .replace(/^0/, "62");


            const message =
                `Halo, saya menemukan ${pet.name || "hewan Anda"}.`;


            waBtn.href =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        }


        // ====================================
        // Foto
        // ====================================

            const petImage =
        document.getElementById("petImage");


        if (
            petImage &&
            pet.photo_url
        ) {

            petImage.src =
                pet.photo_url;


            petImage.onerror =
                function () {

                    console.error(
                        "Gagal memuat foto hewan."
                    );

                };

        }

    }

    catch (error) {

        console.error(
            "PUBLIC PET ERROR:",
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