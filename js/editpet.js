// ===============================
// Current User
// ===============================

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

    window.location.href = "login.html";

}

const params = new URLSearchParams(window.location.search);

const petId = Number(params.get("id"));
const pets = JSON.parse(localStorage.getItem("pets")) || [];
const pet = pets.find(item => item.id === petId);

if (!pet) {

    alert("Data hewan tidak ditemukan.");

    window.location.href = "mypets.html";

}

// ===============================
// Cek Kepemilikan
// ===============================

if(pet.ownerEmail !== currentUser.email){

    alert("Anda tidak memiliki akses untuk mengedit hewan ini.");

    window.location.href = "mypets.html";

}

document.getElementById("petName").value = pet.name;
document.getElementById("petType").value = pet.type;
document.getElementById("breed").value = pet.breed;
document.getElementById("birth").value = pet.birth;
document.getElementById("gender").value = pet.gender;
document.getElementById("color").value = pet.color;
document.getElementById("weight").value = pet.weight;
document.getElementById("owner").value = pet.owner;
document.getElementById("phone").value = pet.phone;
document.getElementById("address").value = pet.address;
document.getElementById("note").value = pet.note;
document.getElementById("previewImage").src = pet.photo;

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("petImage");
const previewImage = document.getElementById("previewImage");
const placeholder = document.getElementById("uploadPlaceholder");

uploadArea.addEventListener("click", () => {

    fileInput.click();

});

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

        placeholder.style.display = "none";

    };

    reader.readAsDataURL(file);

});

// =============================
// Simpan Data Dummy
// =============================

const petForm = document.getElementById("petForm");

petForm.addEventListener("submit", function(e){

    e.preventDefault();

    savePet();

});

function savePet() {

    // Ambil semua data lama
    let pets = JSON.parse(localStorage.getItem("pets")) || [];

    // Cari index berdasarkan ID
    const index = pets.findIndex(item => item.id === petId);

    if (index === -1) {

        alert("Data hewan tidak ditemukan.");

        return;

    }

    // Update object
    pets[index] = {

        ...pets[index],

        name: document.getElementById("petName").value,

        type: document.getElementById("petType").value,

        breed: document.getElementById("breed").value,

        birth: document.getElementById("birth").value,

        gender: document.getElementById("gender").value,

        color: document.getElementById("color").value,

        weight: document.getElementById("weight").value,

        owner: document.getElementById("owner").value,

        phone: document.getElementById("phone").value,

        address: document.getElementById("address").value,

        note: document.getElementById("note").value,

        photo: document.getElementById("previewImage").src

    };

    // Simpan kembali
    localStorage.setItem(
        "pets",
        JSON.stringify(pets)
    );

    alert("Data berhasil diperbarui.");

    window.location.href = "mypets.html";

}

// ===========================
// Logout
// ===========================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const confirmLogout = confirm(
            "Apakah Anda yakin ingin logout?"
        );

        if (confirmLogout) {

            window.location.href = "login.html";

        }

    });

}

updateAvatar();