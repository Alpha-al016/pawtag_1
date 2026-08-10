let currentFilter = "all";
let currentSort = "newest";

// ===============================
// Current User
// ===============================

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

    window.location.href = "login.html";

}

// ===============================
// Animasi Pet Card
// ===============================

const petCards = document.querySelectorAll(".pet-card");

petCards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = "0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, index * 150);

});


// ===============================
// Detail Pet
// ===============================

const detailButtons = document.querySelectorAll(".detail-btn");

detailButtons.forEach(button => {

    button.addEventListener("click", () => {

        

    });

});

// ===============================
// Hubungkan NFC
// ===============================

const nfcButtons = document.querySelectorAll(".nfc-btn");

nfcButtons.forEach(button => {

    button.addEventListener("click", () => {

        

    });

});

// ===============================
// Edit Pet
// ===============================

const editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach(button => {

    button.addEventListener("click", () => {

        

    });

});

function loadPets(){

    const petGrid = document.getElementById("petGrid");
    const keyword = document.getElementById("searchInput")
    ?.value
    .toLowerCase()
    .trim() || "";

    const allPets = JSON.parse(
        localStorage.getItem("pets")
    ) || [];

    const pets = allPets.filter(
        pet => pet.ownerEmail === currentUser.email
    );

    if (pets.length === 0) {

        petGrid.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">🐾</div>

                <h2>Belum Ada Hewan</h2>

                <p>
                    Tambahkan hewan pertamamu untuk mulai menggunakan Paw Tag.
                </p>

                <a href="addpet.html" class="add-first-btn">
                    + Tambah Hewan
                </a>

            </div>
        `;

        return;
    }

    console.log(pets);

    const filteredPets = pets.filter((pet) => {

        const matchSearch =
            pet.name.toLowerCase().includes(keyword);

        const matchFilter =
            currentFilter === "all" ||
            pet.type === currentFilter;

        return matchSearch && matchFilter;

    });

    filteredPets.sort((a,b)=>{
        switch(currentSort){
            case "newest":
                return b.id - a.id;
            case "oldest":
                return a.id - b.id;
            case "az":
                return a.name.localeCompare(b.name);
            case "za":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    petGrid.innerHTML = "";

     if (filteredPets.length === 0 && keyword !== "") {

            petGrid.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">🔍</div>

                    <h2>Hewan Tidak Ditemukan</h2>

                    <p>Coba gunakan kata kunci lain.</p>

                </div>
            `;

            return;

        }


    filteredPets.forEach((pet)=>{

        const card = `

        <div class="pet-card">

            <img
                src="${pet.photo || "../assets/img/default-pet.jpg"}"
                class="pet-image">

            <h3>${pet.name}</h3>

            <p>${pet.breed}</p>

            <span class="status ${pet.nfcStatus ? "active" : "inactive"}">

                ${pet.nfcStatus ? "NFC Aktif" : "Belum Aktif"}

            </span>

            <div class="pet-actions">

                <button class="detail-btn" data-id="${pet.id}">
                    Detail
                </button>

                <button class="edit-btn" data-id="${pet.id}">
                    Edit
                </button>

                <button class="delete-btn" data-id="${pet.id}">
                    Hapus
                </button>

            </div>

        </div>

        `;

        petGrid.insertAdjacentHTML("beforeend", card);

    });

    setupDetailButtons();
    setupEditButtons();
    setupDeleteButtons();
}

function setupFilterButtons() {

    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Hapus active dari semua tombol
            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            // Activekan tombol yang dipilih
            button.classList.add("active");

            // Simpan filter
            currentFilter = button.dataset.filter;

            // Render ulang daftar hewan
            loadPets();

        });

    });

}

function setupDetailButtons(){

    const buttons =
    document.querySelectorAll(".detail-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const id =
            button.dataset.id;

            window.location.href =
            `petdetail.html?id=${id}`;

        });

    });

}

function setupEditButtons(){

    const buttons =
    document.querySelectorAll(".edit-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const id =
            button.dataset.id;

            window.location.href =
            `editpet.html?id=${id}`;

        });

    });

}

function setupDeleteButtons(){

    const buttons =
    document.querySelectorAll(".delete-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const id =
            Number(button.dataset.id);

            const confirmDelete =
            confirm("Yakin ingin menghapus hewan ini?");

            if(!confirmDelete){

                return;

            }

            deletePet(id);

        });

    });

}

function deletePet(id){

    let pets =
    JSON.parse(localStorage.getItem("pets")) || [];

    pets =
    pets.filter(item=>item.id!==id);

    localStorage.setItem(
        "pets",
        JSON.stringify(pets)
    );

    loadPets();

}

const searchInput =
document.getElementById("searchInput");

if(searchInput){

    searchInput.addEventListener("input",()=>{

        loadPets();

    });

}

const sortSelect =
document.getElementById("sortSelect");

if(sortSelect){

    sortSelect.addEventListener("change",()=>{

        currentSort = sortSelect.value;

        loadPets();

    });

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

setupFilterButtons();

loadPets();
updateAvatar();