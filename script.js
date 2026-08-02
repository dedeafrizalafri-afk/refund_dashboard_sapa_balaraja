// ======================================
// REFUND DASHBOARD SAPA BALARAJA
// ======================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let allData = [];
let chart = null;

// ======================================
// LOAD DATA DARI GOOGLE SHEETS
// ======================================

async function loadData() {

    const response = await fetch(SHEET_URL);

    const csv = await response.text();

    const rows = csv.trim().split("\n");

    const headers = rows[0].split(",");

    // INDEX HEADER

    const idxTanggal = headers.indexOf("TGL ORDER");
    const idxKode = headers.indexOf("KODE TOKO");
    const idxNama = headers.indexOf("NAMA TOKO");
    const idxOrder = headers.indexOf("NO ORDER");
    const idxCustomer = headers.indexOf("NAMA CUSTOMER");
    const idxQty = headers.indexOf("QTY");
    const idxStatus = headers.indexOf("PENANGANAN");

    allData = [];

    for (let i = 1; i < rows.length; i++) {

        const col = rows[i].split(",");

        allData.push({

            tanggal: col[idxTanggal] || "",

            kode: col[idxKode] || "",

            nama: col[idxNama] || "",

            order: col[idxOrder] || "",

            customer: col[idxCustomer] || "",

            qty: Number(col[idxQty]) || 0,

            status: col[idxStatus] || ""

        });

    }

    isiFilterToko();

    filterData();

}

// ======================================
// ISI DROPDOWN TOKO
// ======================================

function isiFilterToko() {

    const select = document.getElementById("filterToko");

    const valueSekarang = select.value;

    const daftar = [...new Set(allData.map(x => x.kode))].sort();

    select.innerHTML = `<option value="">Semua Toko</option>`;

    daftar.forEach(kode => {

        const option = document.createElement("option");

        option.value = kode;

        option.textContent = kode;

        if (kode === valueSekarang) {

            option.selected = true;

        }

        select.appendChild(option);

    });

}

// ======================================
// FILTER DATA
// ======================================

function filterData() {

    const dari = document.getElementById("filterDari").value;

    const sampai = document.getElementById("filterSampai").value;

    const toko = document.getElementById("filterToko").value;

    let hasil = [...allData];

   // ======================================
// FILTER TANGGAL
// ======================================

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

    const tgl =
        p[2] + "-" +
        bulan[p[1]] + "-" +
        p[0].padStart(2, "0");

    if (dari && tgl < dari) return false;

    if (sampai && tgl > sampai) return false;

    return true;

});

// ======================================
// FILTER TOKO
// ======================================

if (toko !== "") {

    hasil = hasil.filter(item => item.kode === toko);

}

// ======================================
// HITUNG DASHBOARD
// ======================================

const totalPending = hasil.length;

const totalRefund = hasil.filter(item =>
    item.status.trim().toUpperCase() === "REFUND"
).length;

const totalQty = hasil.reduce((a, b) => a + b.qty, 0);

const totalToko = new Set(
    hasil.map(item => item.kode)
).size;

document.getElementById("pending").textContent = totalPending;

document.getElementById("refund").textContent = totalRefund;

document.getElementById("qty").textContent = totalQty;

document.getElementById("toko").textContent = totalToko;

document.getElementById("lastUpdate").textContent =
"Last Update : " +
new Date().toLocaleString("id-ID");

// ======================================
// TABEL
// ======================================

const tbody = document.querySelector("#dataTable tbody");

tbody.innerHTML = "";

hasil.forEach(item => {

    const badge =
        item.status.trim().toUpperCase() === "REFUND"
        ? '<span class="status-refund">REFUND</span>'
        : '<span class="status-pending">PENDING</span>';

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

// ======================================
// GRAFIK
// ======================================

const ctx = document.getElementById("myChart");

if (chart) {
    chart.destroy();
}

chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Pending", "Refund"],
        datasets: [{
            label: "Jumlah",
            data: [totalPending, totalRefund],
            backgroundColor: [
                "#f59e0b",
                "#10b981"
            ],
            borderRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

} // akhir function filterData()

// ======================================
// SEARCH
// ======================================

document.getElementById("searchInput").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    document.querySelectorAll("#dataTable tbody tr").forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

});

// ======================================
// EVENT FILTER
// ======================================

document.getElementById("btnFilter").addEventListener("click", filterData);

document.getElementById("filterDari").addEventListener("change", filterData);

document.getElementById("filterSampai").addEventListener("change", filterData);

document.getElementById("filterToko").addEventListener("change", filterData);

// ======================================
// MENU
// ======================================

const btnDashboard = document.getElementById("btnDashboard");
const btnData = document.getElementById("btnData");

btnDashboard.onclick = function () {

    document.getElementById("dashboardPage").style.display = "block";
    document.getElementById("dataPage").style.display = "none";

    btnDashboard.classList.add("active");
    btnData.classList.remove("active");

}

btnData.onclick = function () {

    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("dataPage").style.display = "block";

    btnData.classList.add("active");
    btnDashboard.classList.remove("active");

}

// ======================================
// LOAD AWAL
// ======================================

loadData().catch(err => {
    console.error(err);
    alert("Gagal mengambil data dari Google Sheets.");
});
