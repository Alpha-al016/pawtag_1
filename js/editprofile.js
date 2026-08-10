// ===============================
// Ambil Data Login
// ===============================

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

let users =
JSON.parse(localStorage.getItem("users")) || [];

// Cari index user yang sedang login
const userIndex =
users.findIndex(
    u => u.email === currentUser.email
);

const user = users[userIndex];

// ===============================
// Ambil Form
// ===============================

const form =
document.getElementById("editProfileForm");

const userName =
document.getElementById("userName");

const userEmail =
document.getElementById("userEmail");

const userPhone =
document.getElementById("userPhone");

const userAddress =
document.getElementById("userAddress");

// ===============================
// Load Data
// ===============================

userName.value = user.name || "";
userEmail.value = user.email || "";
userPhone.value = user.phone || "";
userAddress.value = user.address || "";

// ===============================
// Simpan
// ===============================

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    users[userIndex].name =
        userName.value.trim();

    users[userIndex].email =
        userEmail.value.trim().toLowerCase();

    users[userIndex].phone =
        userPhone.value.trim();

    users[userIndex].address =
        userAddress.value.trim();

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    // kalau email berubah, currentUser juga ikut berubah
    currentUser.email =
        users[userIndex].email;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    alert("Profile berhasil diperbarui!");

    window.location.href =
    "profile.html";

});

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