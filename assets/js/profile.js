// ===============================
// Ambil Data User
// ===============================

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

// ===============================
// Ambil Elemen
// ===============================

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileAddress =
    document.getElementById("profileAddress");

const profileAvatar =
    document.getElementById("profileAvatar");

// ===============================
// Tampilkan Data
// ===============================

profileName.textContent =
    user.name || "Belum diisi";

profileEmail.textContent =
    user.email || "Belum diisi";

profilePhone.textContent =
    user.phone || "Belum diisi";

profileAddress.textContent =
    user.address || "Belum diisi";

// ===============================
// Avatar
// ===============================

if (user.name) {

    profileAvatar.textContent =
        user.name.charAt(0).toUpperCase();

} else {

    profileAvatar.textContent = "P";

}

const editBtn = document.getElementById("editBtn");

if(editBtn){

    editBtn.addEventListener("click",()=>{

        window.location.href="editprofile.html";

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

updateAvatar();