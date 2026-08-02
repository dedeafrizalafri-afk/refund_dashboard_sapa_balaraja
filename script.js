// ===============================
// REFUND DASHBOARD SAPA BALARAJA
// ===============================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let chart = null;
let allData = [];

// ===============================
// LOAD DATA
// ===============================

async function loadData(){

const response = await fetch(SHEET_URL);

const csv = await response.text();

const rows = csv.trim().split("\n");

const headers = rows[0].split(",");

// ===============================
// INDEX KOLOM
// ===============================

const tanggalIndex = headers.indexOf("TGL ORDER");
const kodeIndex = headers.indexOf("KODE TOKO");
const namaIndex = headers.indexOf("NAMA TOKO");
const orderIndex = headers.indexOf("NO ORDER");
const customerIndex = headers.indexOf("NAMA CUSTOMER");
const qtyIndex = headers.indexOf("QTY");
const penangananIndex = headers.indexOf("PENANGANAN");

// kosongkan data lama

allData=[];

// ===============================
// UBAH CSV MENJADI OBJECT
// ===============================

for(let i=1;i<rows.length;i++){

const cols = rows[i].split(",");

allData.push({

tanggal: cols[tanggalIndex],

kode: cols[kodeIndex],

nama: cols[namaIndex],

order: cols[orderIndex],

customer: cols[customerIndex],

qty: Number(cols[qtyIndex])||0,

status: cols[penangananIndex]

});

}

// lanjut ke filter

filterData();

}

// ===============================
// FILTER DATA
// ===============================

function filterData(){

const dari=document.getElementById("filterDari").value;

const sampai=document.getElementById("filterSampai").value;

const toko=document.getElementById("filterToko").value;

let hasil=[...allData];

// ===============================
// FILTER TANGGAL
// ===============================

if(dari!=""){

hasil=hasil.filter(item=>{

const p=item.tanggal.split("-");

const bulan={
Jan:"01",
Feb:"02",
Mar:"03",
Apr:"04",
May:"05",
Jun:"06",
Jul:"07",
Aug:"08",
Sep:"09",
Oct:"10",
Nov:"11",
Dec:"12"
};

const tgl=

p[2]+"-"+bulan[p[1]]+"-"+p[0].padStart(2,"0");

return tgl>=dari;

});

}

if(sampai!=""){

hasil=hasil.filter(item=>{

const p=item.tanggal.split("-");

const bulan={
Jan:"01",
Feb:"02",
Mar:"03",
Apr:"04",
May:"05",
Jun:"06",
Jul:"07",
Aug:"08",
Sep:"09",
Oct:"10",
Nov:"11",
Dec:"12"
};

const tgl=

p[2]+"-"+bulan[p[1]]+"-"+p[0].padStart(2,"0");

return tgl<=sampai;

});

}

// ===============================
// FILTER TOKO
// ===============================

if(toko!=""){

hasil=hasil.filter(item=>item.kode==toko);

}

// ===============================
// DROPDOWN TOKO
// ===============================

const select = document.getElementById("filterToko");
const tokoList = [...new Set(allData.map(x => x.kode).filter(Boolean))].sort();

const tokoTerpilih = select.value;

select.innerHTML = '<option value="">Semua Toko</option>';

tokoList.forEach(kode => {
    const option = document.createElement("option");
    option.value = kode;
    option.textContent = kode;

    if (kode === tokoTerpilih) {
        option.selected = true;
    }

    select.appendChild(option);
});

// ===============================
// HITUNG DASHBOARD
// ===============================

const totalPending = hasil.length;

const totalRefund = hasil.filter(item =>
    item.status &&
    item.status.trim().toUpperCase() === "REFUND"
).length;

const totalQty = hasil.reduce((a, b) => a + b.qty, 0);

const totalToko = new Set(hasil.map(item => item.kode)).size;

document.getElementById("pending").textContent = totalPending;
document.getElementById("refund").textContent = totalRefund;
document.getElementById("qty").textContent = totalQty;
document.getElementById("toko").textContent = totalToko;

document.getElementById("lastUpdate").textContent =
"Last Update : " + new Date().toLocaleString("id-ID");

// ===============================
// TABEL
// ===============================

const tbody = document.querySelector("#dataTable tbody");

tbody.innerHTML = "";

hasil.forEach(item => {

    const tr = document.createElement("tr");

    const badge =
        item.status &&
        item.status.trim().toUpperCase() === "REFUND"
        ? '<span class="status-refund">REFUND</span>'
        : '<span class="status-pending">PENDING</span>';

    tr.innerHTML = `
        <td>${item.tanggal}</td>
        <td>${item.kode}</td>
        <td>${item.nama}</td>
        <td>${item.order}</td>
        <td>${item.customer}</td>
        <td>${item.qty}</td>
        <td>${badge}</td>
    `;

    tbody.appendChild(tr);

});

// ===============================
// GRAFIK
// ===============================

const ctx = document.getElementById("myChart");

if (chart) {
    chart.destroy();
}

chart = new Chart(ctx, {

    type: "bar",

    data: {

        labels: ["Pending", "Refund"],

        datasets: [{

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

        plugins: {

            legend: {

                display: false

            }

        }

    }

});

// ===============================
// SEARCH
// ===============================

document.getElementById("searchInput").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    document.querySelectorAll("#dataTable tbody tr").forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

});

// ===============================
// FILTER BUTTON
// ===============================

document.getElementById("btnFilter").addEventListener("click", function(){

    filterData();

});

// ===============================
// MENU
// ===============================

const btnDashboard = document.getElementById("btnDashboard");

const btnData = document.getElementById("btnData");

btnDashboard.onclick=function(){

    document.getElementById("dashboardPage").style.display="block";

    document.getElementById("dataPage").style.display="none";

    btnDashboard.classList.add("active");

    btnData.classList.remove("active");

}

btnData.onclick=function(){

    document.getElementById("dashboardPage").style.display="none";

    document.getElementById("dataPage").style.display="block";

    btnData.classList.add("active");

    btnDashboard.classList.remove("active");

}

// ===============================
// FILTER OTOMATIS
// ===============================

document.getElementById("filterDari").addEventListener("change",filterData);

document.getElementById("filterSampai").addEventListener("change",filterData);

document.getElementById("filterToko").addEventListener("change",filterData);

// ===============================
// LOAD PERTAMA
// ===============================

loadData();
