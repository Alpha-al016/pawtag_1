// ===============================
// Current User
// ===============================

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

    alert("Silakan login terlebih dahulu.");

    window.location.href = "login.html";

}

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

function savePet(){
    const petName =
    document.getElementById("petName").value;

    const petType =
    document.getElementById("petType").value;

    const breed =
    document.getElementById("breed").value;

    if(

    petName==="" ||

    petType==="" ||

    breed===""

    ){

    alert("Mohon lengkapi data.");

    return;

    }

    const pet = {

    id: Date.now(),

    name: petName,

    type: petType,

    breed: breed,

    gender: document.getElementById("gender").value,

    birth: document.getElementById("birth").value,

    color: document.getElementById("color").value,

    weight: document.getElementById("weight").value,

    owner: document.getElementById("owner").value,

    ownerEmail: currentUser.email,

    phone: document.getElementById("phone").value,

    address: document.getElementById("address").value,

    note: document.getElementById("note").value,

    photo: previewImage.src,

    nfcStatus:false

};

    // Ambil data lama
    let pets =
    JSON.parse(
    localStorage.getItem("pets")
    ) || [];

    // Tambahkan data baru
    pets.push(pet);

    // Simpan lagi
    localStorage.setItem(
        "pets",
        JSON.stringify(pets)
    );

    alert(

    "Hewan berhasil ditambahkan."

    );

    window.location.href="mypets.html";
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