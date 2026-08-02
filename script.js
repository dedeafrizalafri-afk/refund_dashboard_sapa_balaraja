// =====================================
// REFUND DASHBOARD SAPA BALARAJA V2
// =====================================

// ================================
// GOOGLE SHEETS CSV
// ================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

// ================================
// GLOBAL VARIABLE
// ================================

let allData = [];
let chart = null;

// ================================
// PARSE CSV
// ================================

function parseCSV(csv) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuote = false;

    for (let i = 0; i < csv.length; i++) {

        const c = csv[i];

        if (c === '"') {

            if (insideQuote && csv[i + 1] === '"') {

                value += '"';

                i++;

            } else {

                insideQuote = !insideQuote;

            }

            continue;

        }

        if (c === "," && !insideQuote) {

            row.push(value);

            value = "";

            continue;

        }

        if ((c === "\n" || c === "\r") && !insideQuote) {

            if (value !== "" || row.length > 0) {

                row.push(value);

                rows.push(row);

                row = [];

                value = "";

            }

            continue;

        }

        value += c;

    }

    if (value !== "" || row.length > 0) {

        row.push(value);

        rows.push(row);

    }

    return rows;

}

// ================================
// LOAD DATA
// ================================

async function loadData() {

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {

            throw new Error("Tidak dapat mengambil data.");

        }

        const csv = await response.text();

        const rows = parseCSV(csv);

        if (rows.length <= 1) {

            throw new Error("Data kosong.");

        }

        const headers = rows[0].map(x => x.trim().toUpperCase());

        const idxTanggal = headers.indexOf("TGL ORDER");
        const idxKode = headers.indexOf("KODE TOKO");
        const idxNama = headers.indexOf("NAMA TOKO");
        const idxOrder = headers.indexOf("NO ORDER");
        const idxCustomer = headers.indexOf("NAMA CUSTOMER");
        const idxQty = headers.indexOf("QTY");
        const idxStatus = headers.indexOf("PENANGANAN");

        allData = [];

        for (let i = 1; i < rows.length; i++) {

            const col = rows[i];

            allData.push({

                tanggal: col[idxTanggal] || "",

                kode: col[idxKode] || "",

                nama: col[idxNama] || "",

                order: col[idxOrder] || "",

                customer: col[idxCustomer] || "",

                qty: Number(col[idxQty]) || 0,

                status: (col[idxStatus] || "").trim().toUpperCase()

            });

        }

        isiFilterToko();

        filterData();

    } catch (err) {

        console.error(err);

        alert("Gagal mengambil data Google Sheets.");

    }

}
// =====================================
// ISI DROPDOWN TOKO
// =====================================

function isiFilterToko() {

    const select = document.getElementById("filterToko");

    const current = select.value;

    const daftar = [...new Set(allData.map(item => item.kode))]
        .filter(item => item !== "")
        .sort();

    select.innerHTML = `<option value="">Semua Toko</option>`;

    daftar.forEach(kode => {

        const option = document.createElement("option");

        option.value = kode;

        option.textContent = kode;

        if (kode === current) {

            option.selected = true;

        }

        select.appendChild(option);

    });

}

// =====================================
// FILTER DATA
// =====================================

function filterData() {

    const dari = document.getElementById("filterDari").value;

    const sampai = document.getElementById("filterSampai").value;

    const toko = document.getElementById("filterToko").value;

    const status = document.getElementById("filterStatus").value;

    let hasil = [...allData];

    // ==========================
    // FILTER TOKO
    // ==========================

    if (toko !== "") {

        hasil = hasil.filter(item => item.kode === toko);

    }

    // ==========================
    // FILTER STATUS
    // ==========================

    if (status !== "") {

        hasil = hasil.filter(item => item.status === status);

    }

    // ==========================
// FILTER TANGGAL
// ==========================

if (dari || sampai) {

    hasil = hasil.filter(item => {

        if (!item.tanggal) return false;

        const p = item.tanggal.split("-");

        if (p.length !== 3) return true;

        const bulan = {

            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"

        };

        const tanggal =
            p[2] + "-" +
            bulan[p[1]] + "-" +
            p[0].padStart(2, "0");

        if (dari && tanggal < dari) return false;

        if (sampai && tanggal > sampai) return false;

        return true;

    });

}

    // ==========================
    // HITUNG DASHBOARD
    // ==========================

    const totalPending =
        hasil.filter(item => item.status === "PENDING").length;

    const totalRefund =
        hasil.filter(item => item.status === "REFUND").length;

    const totalKirimUlang =
        hasil.filter(item => item.status === "KIRIM ULANG").length;

    const totalQty =
        hasil.reduce((total, item) => total + item.qty, 0);

    const totalToko =
        new Set(hasil.map(item => item.kode)).size;

    // ==========================
    // UPDATE CARD
    // ==========================

    document.getElementById("pending").textContent =
        totalPending.toLocaleString("id-ID");

    document.getElementById("refund").textContent =
        totalRefund.toLocaleString("id-ID");

    document.getElementById("kirimUlang").textContent =
        totalKirimUlang.toLocaleString("id-ID");

    document.getElementById("qty").textContent =
        totalQty.toLocaleString("id-ID");

    document.getElementById("toko").textContent =
        totalToko.toLocaleString("id-ID");

    document.getElementById("lastUpdate").textContent =
        "Last Update : " +
        new Date().toLocaleString("id-ID");
        // =====================================
    // TABEL DATA
    // =====================================

    const tbody = document.querySelector("#dataTable tbody");

    tbody.innerHTML = "";

    hasil.forEach(item => {

        let badge = "";

        if (item.status === "REFUND") {

            badge =
            '<span class="status-refund">REFUND</span>';

        }

        else if (item.status === "KIRIM ULANG") {

            badge =
            '<span class="status-kirim">KIRIM ULANG</span>';

        }

        else {

            badge =
            '<span class="status-pending">PENDING</span>';

        }

        tbody.innerHTML += `
<tr>

<td>${item.tanggal}</td>

<td>${item.kode}</td>

<td>${item.nama}</td>

<td>${item.order}</td>

<td>${item.customer}</td>

<td>${item.qty}</td>

<td>${badge}</td>

</tr>
`;

    });

    // =====================================
    // GRAFIK
    // =====================================

    const ctx =
    document.getElementById("myChart");

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "Pending",
                "Refund",
                "Kirim Ulang"
            ],

            datasets:[{

                label:"Jumlah",

                data:[
                    totalPending,
                    totalRefund,
                    totalKirimUlang
                ],

                backgroundColor:[
                    "#f59e0b",
                    "#22c55e",
                    "#3b82f6"
                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        precision:0

                    }

                }

            }

        }

    });

} // ===== AKHIR filterData() =====
// =====================================
// SEARCH DATA
// =====================================

document.getElementById("searchInput").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

});

// =====================================
// EVENT FILTER
// =====================================

document.getElementById("btnFilter").addEventListener("click", filterData);

document.getElementById("filterDari").addEventListener("change", filterData);

document.getElementById("filterSampai").addEventListener("change", filterData);

document.getElementById("filterToko").addEventListener("change", filterData);

document.getElementById("filterStatus").addEventListener("change", filterData);

// =====================================
// MENU DASHBOARD
// =====================================

const btnDashboard = document.getElementById("btnDashboard");

const btnData = document.getElementById("btnData");

btnDashboard.addEventListener("click", function () {

    document.getElementById("dashboardPage").style.display = "block";

    document.getElementById("dataPage").style.display = "none";

    btnDashboard.classList.add("active");

    btnData.classList.remove("active");

});

btnData.addEventListener("click", function () {

    document.getElementById("dashboardPage").style.display = "none";

    document.getElementById("dataPage").style.display = "block";

    btnData.classList.add("active");

    btnDashboard.classList.remove("active");

});
// =====================================
// AUTO REFRESH
// =====================================

setInterval(() => {

    loadData();

}, 60000);

// =====================================
// LOAD AWAL
// =====================================

loadData();

// =====================================
// ERROR HANDLER
// =====================================

window.addEventListener("error", function (e) {

    console.error("JavaScript Error :", e.message);

});

// =====================================
// SELESAI
// =====================================
