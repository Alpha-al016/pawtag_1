// ===============================
// Ambil Current User
// ===============================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

}

// ===============================
// Redirect jika belum login
// ===============================

function requireLogin() {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "login.html";

        return null;

    }

    return currentUser;

}

// ===============================
// Update Avatar
// ===============================

function updateAvatar() {

    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const avatar = document.getElementById("avatar");

    if (avatar) {

        avatar.textContent =
            currentUser.name.charAt(0).toUpperCase();

    }

}

updateAvatar();