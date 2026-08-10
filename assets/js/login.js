// ===============================
// SHOW / HIDE PASSWORD
// ===============================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

        togglePassword.classList.remove("bi-eye");
        togglePassword.classList.add("bi-eye-slash");

    }else{

        passwordInput.type = "password";

        togglePassword.classList.remove("bi-eye-slash");
        togglePassword.classList.add("bi-eye");

    }

});

// ===============================
// LOGIN FORM
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = passwordInput.value.trim();

    if(email === "" || password === ""){

        alert("Harap isi email dan password.");

        return;

    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Format email tidak valid.");

        return;

    }

    if(password.length < 8){

    alert("Password minimal 8 karakter.");

    return;

    }

    // ===============================
    // Ambil Data User
    // ===============================

    const users =
    JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.email === email);

        if(!user){

        alert("Email belum terdaftar.");

        return;

    }

    if(user.password !== password){

        alert("Password salah.");

        return;

    }

    localStorage.setItem(

        "currentUser",

        JSON.stringify(user)

    );

    loginBtn.innerHTML = "Loading...";

    loginBtn.disabled = true;

    setTimeout(() => {

        loginBtn.innerHTML = "Login";

        loginBtn.disabled = false;

        window.location.href =
        "dashboard.html";

    },1500);

});

const loginBtn = document.getElementById("loginBtn");