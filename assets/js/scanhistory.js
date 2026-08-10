const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

    window.location.href = "login.html";

}

const historyList =
document.getElementById("historyList");

const histories =
JSON.parse(localStorage.getItem("scanHistory")) || [];

const userHistory =
histories.filter(item =>
    item.ownerEmail === currentUser.email
);

historyList.innerHTML = "";

// ===============================
// Tidak Ada Riwayat
// ===============================

if(userHistory.length === 0){

    historyList.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">📡</div>

            <h2>Belum Ada Scan</h2>

            <p>
                Riwayat scan NFC akan muncul di sini.
            </p>

        </div>

    `;

}else{

    userHistory
        .sort((a,b)=>
            new Date(b.scanTime) -
            new Date(a.scanTime)
        );

    userHistory.forEach(item=>{

        const tanggal =
        new Date(item.scanTime);

        const card = `

            <div class="history-card">

                <h3>${item.petName}</h3>

                <p>

                    <strong>Kode NFC :</strong>

                    ${item.nfcCode}

                </p>

                <p>

                    <strong>Waktu Scan :</strong>

                    ${tanggal.toLocaleString("id-ID")}

                </p>

            </div>

        `;

        historyList.insertAdjacentHTML(

            "beforeend",

            card

        );

    });

}