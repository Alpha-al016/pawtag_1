// ============================================
// PAWTAG - CLAIM TAG
// ============================================

console.log("PAWTAG CLAIM PAGE LOADED");


// ============================================
// CONFIG
// ============================================

const FUNCTIONS_URL =
    window.PAWTAG_CONFIG?.FUNCTIONS_URL;


console.log(
    "FUNCTIONS_URL:",
    FUNCTIONS_URL
);


// ============================================
// AMBIL TAG ID
// ============================================

function getTagId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const tagId =
        params.get("tag_id");

    if (!tagId) {

        return null;

    }

    return tagId.trim();

}


// ============================================
// ELEMENT
// ============================================

const form =
    document.getElementById("claimForm");

const tagIdElement =
    document.getElementById("tagId");

const messageElement =
    document.getElementById("message");

const submitButton =
    document.getElementById("submitBtn");


// ============================================
// MESSAGE
// ============================================

function showMessage(
    message,
    type = "error"
) {

    messageElement.textContent =
        message;

    messageElement.className =
        `message ${type}`;

}


// ============================================
// INIT
// ============================================

const tagId =
    getTagId();


console.log(
    "TAG ID:",
    tagId
);


// ============================================
// VALIDASI TAG ID
// ============================================

if (!tagId) {

    tagIdElement.textContent =
        "Tag tidak valid.";

    submitButton.disabled =
        true;

    showMessage(
        "Tag ID tidak ditemukan pada URL.",
        "error"
    );

}


// ============================================
// TAMPILKAN TAG ID
// ============================================

if (tagId) {

    tagIdElement.textContent =
        tagId;

}


// ============================================
// SUBMIT FORM
// ============================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // ------------------------------------
        // Validasi config
        // ------------------------------------

        if (!FUNCTIONS_URL) {

            showMessage(
                "Konfigurasi Supabase tidak ditemukan.",
                "error"
            );

            return;

        }


        // ------------------------------------
        // Validasi tag
        // ------------------------------------

        if (!tagId) {

            showMessage(
                "Tag ID tidak valid.",
                "error"
            );

            return;

        }


        // ------------------------------------
        // Ambil data form
        // ------------------------------------

        const ownerEmail =
            document
                .getElementById("ownerEmail")
                .value
                .trim();

        const ownerName =
            document
                .getElementById("ownerName")
                .value
                .trim();

        const petName =
            document
                .getElementById("petName")
                .value
                .trim();


        const species =
            document
                .getElementById("species")
                .value
                .trim();


        const breed =
            document
                .getElementById("breed")
                .value
                .trim();


        const contactNumber =
            document
                .getElementById("contactNumber")
                .value
                .trim();


        const address =
            document
                .getElementById("address")
                .value
                .trim();


        const notes =
            document
                .getElementById("notes")
                .value
                .trim();


        // ------------------------------------
        // Payload
        // ------------------------------------

        const payload = {

            tag_id: tagId,

            owner_name: ownerName,

            owner_email: ownerEmail,

            name: petName,

            species: species,

            breed: breed,

            contact_number: contactNumber,

            address: address,

            notes: notes

        };


        console.log(
            "CLAIM PAYLOAD:",
            payload
        );


        // ------------------------------------
        // Loading
        // ------------------------------------

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Memproses...";

        messageElement.className =
            "message";


        try {

            // --------------------------------
            // Request
            // --------------------------------

            const response =
                await fetch(
                    `${FUNCTIONS_URL}/claim-tag`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(payload)

                    }
                );


            // --------------------------------
            // Response
            // --------------------------------

            const result =
                await response.json();


            console.log(
                "CLAIM RESPONSE:",
                result
            );


            // --------------------------------
            // Error
            // --------------------------------

            if (!response.ok || !result.success) {

                showMessage(
                    result.error ||
                    "Gagal mengklaim PawTag.",
                    "error"
                );

                return;

            }


            // --------------------------------
            // SUCCESS
            // --------------------------------

            showMessage(
                "PawTag berhasil diklaim!",
                "success"
            );


            // --------------------------------
            // Disable form
            // --------------------------------

            form
                .querySelectorAll("input, textarea, button")
                .forEach(
                    element => {

                        element.disabled =
                            true;

                    }
                );


        }

        catch (error) {

            console.error(
                "CLAIM ERROR:",
                error
            );


            showMessage(
                "Tidak dapat terhubung ke server.",
                "error"
            );

        }

        finally {

            submitButton.textContent =
                "Klaim PawTag";

        }

    }
);