// ===============================
// Current User
// ===============================

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

function loadNFCTags(){

    const grid =
    document.getElementById("nfcGrid");

    const pets =
    JSON.parse(localStorage.getItem("pets")) || [];

    const myPets =
    pets.filter(
        pet=>pet.ownerEmail===currentUser.email
    );

    grid.innerHTML="";

    myPets.forEach(pet=>{

        const card=`

        <div class="nfc-card">

            <div class="nfc-icon">

                📶

            </div>

            <h3>

                ${
                    pet.nfcCode
                    ?
                    pet.nfcCode
                    :
                    "Belum Memiliki NFC"
                }

            </h3>

            <p>

                ${pet.name}

            </p>

            <span class="nfc-status ${
                pet.nfcStatus
                ?
                "nfc-active"
                :
                "nfc-inactive"
            }">

                ${
                    pet.nfcStatus
                    ?
                    "Aktif"
                    :
                    "Belum Aktif"
                }

            </span>

            <button
                class="nfc-btn"
                data-id="${pet.id}"
            >

                ${
                    pet.nfcStatus
                    ?
                    "Kelola"
                    :
                    "Hubungkan"
                }

            </button>

        </div>

        `;

        grid.insertAdjacentHTML(
            "beforeend",
            card
        );

    });

}

function setupNFCButtons(){

    const buttons =
    document.querySelectorAll(".nfc-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const id = button.dataset.id;

            const pets =
            JSON.parse(localStorage.getItem("pets")) || [];

            const pet =
            pets.find(item=>item.id==id);

            if(!pet){

                alert("Data hewan tidak ditemukan.");

                return;

            }

            if(pet.nfcStatus){

                window.location.href=
                `nfcdetail.html?id=${id}`;

            }else{

                window.location.href=
                `connectnfc.html?id=${id}`;

            }

        });

    });

}

loadNFCTags();
setupNFCButtons();
updateAvatar();