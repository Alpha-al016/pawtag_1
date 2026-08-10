// ===============================
// TOGGLE PASSWORD
// ===============================

function setupPasswordToggle(inputId, toggleId){
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener("click", () => {
        if(input.type === "password"){
            input.type = "text";
            toggle.classList.remove("bi-eye");
            toggle.classList.add("bi-eye-slash");
        }else{
            input.type = "password";
            toggle.classList.remove("bi-eye-slash");
            toggle.classList.add("bi-eye");
        }
    });
}

setupPasswordToggle("password","togglePassword");
setupPasswordToggle("confirmPassword","toggleConfirmPassword");

// ===============================
// REGISTER FORM
// ===============================

const registerForm = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");

registerForm.addEventListener("submit", function(e){
    e.preventDefault();
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if(fullname === ""){
    alert("Nama lengkap harus diisi.");
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

    if(password !== confirmPassword){
    alert("Konfirmasi password tidak sama.");
    return;
    }

    const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if(!strongPassword.test(password)){
    alert("Password harus memiliki huruf besar, huruf kecil, dan angka.");
    return;
    }

    // ===============================
    // Ambil Data User
    // ===============================

    let users =
    JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.find(user => user.email === email);

    if(emailExists){

        alert("Email sudah terdaftar.");

        return;

    }

    const newUser = {

        name: fullname,

        email: email,

        password: password,

        phone: "",

        address: ""

    };

    users.push(newUser);
    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

    registerBtn.innerHTML = "Creating Account...";
    registerBtn.disabled = true;
    
    setTimeout(()=>{

        alert("Registrasi berhasil!");

        window.location.href =
        "login.html";

    },1500);
});