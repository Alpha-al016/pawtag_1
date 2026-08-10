// ===============================
// Ambil ID dari URL
// ===============================

const params =
new URLSearchParams(window.location.search);

const petId =
Number(params.get("id"));

const pets =
JSON.parse(localStorage.getItem("pets")) || [];

const pet =
pets.find(item=>item.id===petId);

if(!pet){

    alert("Data hewan tidak ditemukan.");

    window.location.href="nfctag.html";

}

// ===============================
// Public Link
// ===============================

const publicLink =

`${window.location.origin}${window.location.pathname.replace("nfcdetail.html","publicpet.html")}?code=${pet.nfcCode}`;

document.getElementById("publicLink").value =
publicLink;

// ===============================
// Tampilkan Data
// ===============================

document.getElementById("petName").value =
pet.name;

document.getElementById("nfcCode").value =
pet.nfcCode || "-";

document.getElementById("status").value =
pet.nfcStatus
?
"Aktif"
:
"Belum Aktif";

// ===============================
// Ganti Kode NFC
// ===============================

const changeBtn =
document.getElementById("changeBtn");

changeBtn.addEventListener("click",()=>{

    const newCode = prompt(

        "Masukkan kode NFC baru:",

        pet.nfcCode

    );

    if(newCode===null){

        return;

    }

    const code =
    newCode.trim().toUpperCase();

    if(code===""){

        alert("Kode NFC tidak boleh kosong.");

        return;

    }

    // ===============================
    // Validasi Format
    // ===============================

    const nfcPattern = /^NFC-\d{3}$/;

    if(!nfcPattern.test(code)){

        alert("Format kode NFC harus seperti NFC-001.");

        return;

    }

    // ===============================
    // Validasi Duplikat
    // ===============================

    const duplicate = pets.find(item=>

        item.id !== pet.id &&

        item.nfcCode === code

    );

    if(duplicate){

        alert("Kode NFC sudah digunakan oleh hewan lain.");

        return;

    }

    pet.nfcCode = code;

    const index =
    pets.findIndex(item=>item.id===pet.id);

    pets[index]=pet;

    localStorage.setItem(

        "pets",

        JSON.stringify(pets)

    );

    alert("Kode NFC berhasil diperbarui.");

    location.reload();

});

// ===============================
// Putuskan NFC
// ===============================

const unlinkBtn =
document.getElementById("unlinkBtn");

unlinkBtn.addEventListener("click",()=>{

    const confirmDelete = confirm(

        "Yakin ingin memutuskan NFC?"

    );

    if(!confirmDelete){

        return;

    }

    pet.nfcStatus = false;

    pet.nfcCode = null;

    const index =
    pets.findIndex(item=>item.id===pet.id);

    pets[index]=pet;

    localStorage.setItem(

        "pets",

        JSON.stringify(pets)

    );

    alert("NFC berhasil diputuskan.");

    window.location.href="nfctag.html";

});

// ===============================
// Copy Link
// ===============================

const copyBtn =
document.getElementById("copyBtn");

copyBtn.addEventListener("click", async ()=>{

    try{

        await navigator.clipboard.writeText(
            publicLink
        );

        alert("Link berhasil disalin.");

    }catch{

        alert("Gagal menyalin link.");

    }

});

updateAvatar();