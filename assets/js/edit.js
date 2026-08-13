const params = new URLSearchParams(window.location.search);
const secretToken = params.get("secret_token");

const errorMessage = document.getElementById("errorMessage");
const editForm = document.getElementById("editForm");

if (!secretToken) {

    errorMessage.textContent =
        "Link akses tidak valid.";

    editForm.style.display = "none";

    throw new Error("Secret token tidak ditemukan.");
}

const petPhoto =
    document.getElementById("petPhoto");

const petPhotoPreview =
    document.getElementById("petPhotoPreview");


if (petPhoto) {

    petPhoto.addEventListener(
        "change",
        function () {

            const file =
                petPhoto.files[0];

            if (!file) {

                petPhotoPreview.style.display =
                    "none";

                return;

            }


            const imageUrl =
                URL.createObjectURL(file);

            petPhotoPreview.src =
                imageUrl;

            petPhotoPreview.style.display =
                "block";

        }
    );

}

const FUNCTIONS_URL =
    "https://cmyxgygopwutjqzjjgsu.supabase.co/functions/v1";

const API_URL =
    `${FUNCTIONS_URL}/edit-pet?secret_token=${encodeURIComponent(secretToken)}`;

async function loadPet() {

    try {

        const response =
            await fetch(API_URL);

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.error || "Link akses tidak valid."
            );

        }

        const pet = result.pet;

        document.getElementById("petName").value =
            pet.name || "";

        document.getElementById("species").value =
            pet.species || "";

        document.getElementById("breed").value =
            pet.breed || "";

        document.getElementById("contactNumber").value =
            pet.contact_number || "";

        document.getElementById("address").value =
            pet.address || "";

        document.getElementById("notes").value =
            pet.notes || "";

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Link akses tidak valid atau sudah tidak tersedia.";

        editForm.style.display = "none";
    }
}

loadPet();

editForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        try {

            const response =
                await fetch(
                    `${FUNCTIONS_URL}/edit-pet`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({

                            secret_token:
                                secretToken,

                            name:
                                document
                                    .getElementById("petName")
                                    .value,

                            species:
                                document
                                    .getElementById("species")
                                    .value,

                            breed:
                                document
                                    .getElementById("breed")
                                    .value,

                            contact_number:
                                document
                                    .getElementById("contactNumber")
                                    .value,

                            address:
                                document
                                    .getElementById("address")
                                    .value,

                            notes:
                                document
                                    .getElementById("notes")
                                    .value,

                        }),
                    }
                );


            const result =
                await response.json();


            console.log(
                "UPDATE PET RESPONSE:",
                result
            );


            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.error ||
                    "Gagal menyimpan data."
                );

            }

            // ========================================
            // UPLOAD FOTO JIKA ADA
            // ========================================

            const photoFile =
                document
                    .getElementById("petPhoto")
                    ?.files[0];


            if (photoFile) {

                const photoFormData =
                    new FormData();


                photoFormData.append(
                    "secret_token",
                    secretToken
                );


                photoFormData.append(
                    "photo",
                    photoFile
                );


                const photoResponse =
                    await fetch(
                        `${FUNCTIONS_URL}/upload-pet-photo`,
                        {
                            method: "POST",

                            body:
                                photoFormData
                        }
                    );


                const photoResult =
                    await photoResponse.json();


                console.log(
                    "UPLOAD PHOTO RESPONSE:",
                    photoResult
                );


                if (
                    !photoResponse.ok ||
                    !photoResult.success
                ) {

                    throw new Error(
                        photoResult.error ||
                        "Gagal mengupload foto."
                    );

                }

            }


            alert(
                "Data hewan berhasil diperbarui!"
            );


        } catch (error) {

            console.error(
                "UPDATE PET ERROR:",
                error
            );


            alert(
                "Gagal memperbarui data hewan."
            );

        }

    }
);