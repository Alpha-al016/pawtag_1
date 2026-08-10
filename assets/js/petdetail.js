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

    alert("Anda tidak memiliki akses ke data hewan ini.");

    window.location.href = "mypets.html";

}

document.getElementById("detailName").textContent = pet.name;

document.getElementById("detailBreed").textContent = pet.breed;

document.getElementById("detailImage").src = pet.photo;

const status = document.getElementById("detailStatus");

if (pet.nfcStatus) {

    status.textContent = "NFC Aktif";
    status.classList.remove("inactive");
    status.classList.add("active");

} else {

    status.textContent = "Belum Aktif";
}

document.getElementById("infoName").textContent = pet.name;
document.getElementById("infoType").textContent = pet.type;
document.getElementById("infoBreed").textContent = pet.breed;
document.getElementById("infoBirth").textContent = pet.birth;
document.getElementById("infoGender").textContent = pet.gender;
document.getElementById("infoColor").textContent = pet.color;
document.getElementById("infoWeight").textContent = pet.weight;

document.getElementById("ownerName").textContent = pet.owner;
document.getElementById("ownerPhone").textContent = pet.phone;
document.getElementById("ownerAddress").textContent = pet.address;

document.getElementById("petNote").textContent =
pet.note || "Tidak ada catatan.";

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