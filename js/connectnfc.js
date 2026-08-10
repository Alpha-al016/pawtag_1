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

document.getElementById("petName").value =
pet.name;

const form =
document.getElementById("connectForm");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const code =
    document.getElementById("nfcCode")
    .value
    .trim().toUpperCase();

    if(code===""){

        alert("Kode NFC wajib diisi.");

        return;

    }

    const nfcPattern = /^NFC-\d{3}$/;

    if (!nfcPattern.test(code)) {

        alert("Format kode NFC harus seperti NFC-001.");

        return;

    }

    const duplicate = pets.find(item =>
        item.id !== pet.id &&
        item.nfcCode === code
    );

    if (duplicate) {

        alert("Kode NFC sudah digunakan oleh hewan lain.");

        return;

    }

    pet.nfcCode = code;

    pet.nfcStatus = true;

    const index =
    pets.findIndex(item=>item.id===pet.id);

    pets[index]=pet;

    localStorage.setItem(

        "pets",

        JSON.stringify(pets)

    );

    alert("NFC berhasil dihubungkan.");

    window.location.href="nfctag.html";

});

updateAvatar();