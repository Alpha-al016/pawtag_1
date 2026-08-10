const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

const users =
JSON.parse(localStorage.getItem("users")) || [];

if(!currentUser){

    window.location.href="login.html";

}

const user =
users.find(
    u => u.email === currentUser.email
);

if(!user){

    window.location.href="login.html";

}
// ===========================
// Greeting berdasarkan waktu
// ===========================

const welcomeTitle = document.querySelector(".welcome h1");
const hour = new Date().getHours();
let greeting = "";
if(hour < 11){
    greeting = "Selamat Pagi";
}else if(hour < 15){
    greeting = "Selamat Siang";
}else if(hour < 18){
    greeting = "Selamat Sore";
}else{
    greeting = "Selamat Malam";
}
welcomeTitle.innerHTML = `${greeting}, ${user.name} 👋`;

// ===========================
// Sidebar Active
// ===========================

const menuItems = document.querySelectorAll(".sidebar a");
menuItems.forEach(item=>{
    item.addEventListener("click",()=>{
        menuItems.forEach(i=>{
            i.classList.remove("active");
        });
        item.classList.add("active");
    });
});

// ===========================
// Fade Card
// ===========================

const cards = document.querySelectorAll(".pet-card");
cards.forEach((card,index)=>{
    card.style.opacity=0;
    card.style.transform="translateY(30px)";
    setTimeout(()=>{
        card.style.transition=".6s";
        card.style.opacity=1;
        card.style.transform="translateY(0)";
    },index*200);
});

function loadDashboardStats(){

    const allPets =
        JSON.parse(localStorage.getItem("pets")) || [];

    const pets =
        allPets.filter(
            pet => pet.ownerEmail === currentUser.email
        );

    const totalPets = pets.length;

    const activeNFC =
        pets.filter(pet => pet.nfcStatus).length;

    const inactiveNFC =
        totalPets - activeNFC;

    document.getElementById("totalPets").textContent =
        totalPets;

    document.getElementById("activeNFC").textContent =
        activeNFC;

    document.getElementById("inactiveNFC").textContent =
        inactiveNFC;

}

function loadRecentPets(){

    const petGrid =
        document.getElementById("recentPetGrid");

    const allPets =
    JSON.parse(localStorage.getItem("pets")) || [];

    const pets =
    allPets.filter(
        pet => pet.ownerEmail === currentUser.email
    );

    petGrid.innerHTML = "";

    const recentPets = pets.slice(-3).reverse();

    recentPets.forEach((pet)=>{

        const card = `

        <div class="pet-card">

            <img
                src="${pet.photo || "../assets/img/default-pet.jpg"}"
                class="pet-image">

            <h3>${pet.name}</h3>

            <p>${pet.breed}</p>

            <span class="${pet.nfcStatus ? "active" : "inactive"}">

                ${pet.nfcStatus ? "NFC Aktif" : "Belum Aktif"}

            </span>

        </div>

        `;

        petGrid.insertAdjacentHTML("beforeend", card);

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

loadDashboardStats();
loadRecentPets();
updateAvatar();