// ===============================
// Ambil ID dari URL
// ===============================

const params = new URLSearchParams(window.location.search);

const code = params.get("code");

// ===============================
// Ambil Data
// ===============================

const pets =
JSON.parse(localStorage.getItem("pets")) || [];

const pet =
pets.find(item => item.nfcCode === code);

if(!pet){

    alert("Data hewan tidak ditemukan.");

    window.location.href = "../index.html";

}

// ===============================
// Simpan Scan History
// ===============================

let scanHistory =
JSON.parse(localStorage.getItem("scanHistory")) || [];

scanHistory.push({

    id: Date.now(),

    petId: pet.id,

    petName: pet.name,

    ownerEmail: pet.ownerEmail,

    nfcCode: pet.nfcCode,

    scanTime: new Date().toISOString()

});

localStorage.setItem(

    "scanHistory",

    JSON.stringify(scanHistory)

);

// ===============================
// Tampilkan Data Hewan
// ===============================

document.getElementById("petImage").src =
pet.photo;

document.getElementById("petName").textContent =
pet.name;

document.getElementById("petBreed").textContent =
pet.breed;

// ===============================
// Status NFC
// ===============================

const status =
document.getElementById("petStatus");

if(pet.nfcStatus){

    status.textContent = "🟢 NFC Aktif";

}else{

    status.textContent = "⚪ NFC Belum Aktif";

}

// ===============================
// Data Pemilik
// ===============================

document.getElementById("ownerName").textContent =
pet.owner;

document.getElementById("ownerPhone").textContent =
pet.phone;

document.getElementById("ownerAddress").textContent =
pet.address;

// ===============================
// Catatan
// ===============================

document.getElementById("petNote").textContent =
pet.note || "Tidak ada catatan.";

// ===============================
// Tombol Telepon
// ===============================

document.getElementById("callBtn").href =
`tel:${pet.phone}`;

// ===============================
// Tombol WhatsApp
// ===============================

const phone =
pet.phone.replace(/^0/, "62");

document.getElementById("waBtn").href =
`https://wa.me/${phone}?text=Halo,%20saya%20menemukan%20${pet.name}.`;