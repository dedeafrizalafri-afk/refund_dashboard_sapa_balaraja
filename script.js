// ===============================
// GOOGLE SHEETS URL
// ===============================

const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let chart;

// ===============================
// LOAD DATA
// ===============================

function loadData(){

fetch(sheetURL)

.then(res=>res.text())

.then(text=>{

const rows=text.trim().split("\n");

const headers=rows[0].split(",");

// ===============================
// INDEX KOLOM
// ===============================

const tanggalIndex=headers.indexOf("TGL ORDER");
const kodeIndex=headers.indexOf("KODE TOKO");
const namaIndex=headers.indexOf("NAMA TOKO");
const orderIndex=headers.indexOf("NO ORDER");
const customerIndex=headers.indexOf("CUSTOMER");
const qtyIndex=headers.indexOf("QTY");
const penangananIndex=headers.indexOf("PENANGANAN");

// ===============================
// FILTER
// ===============================

const filterTanggal=document.getElementById("filterTanggal").value;

const filterToko=document.getElementById("filterToko").value;

// ===============================
// VARIABLE
// ===============================

let totalPending=0;
let totalRefund=0;
let totalQty=0;

const daftarToko=new Set();

const tbody=document.querySelector("#dataTable tbody");

tbody.innerHTML="";

// ===============================
// ISI DROPDOWN TOKO
// ===============================

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(cols[kodeIndex]){

daftarToko.add(cols[kodeIndex].trim());

}

}

const select=document.getElementById("filterToko");

select.innerHTML="<option value=''>Semua Toko</option>";

Array.from(daftarToko)
.sort()
.forEach(toko=>{

const option=document.createElement("option");

option.value=toko;

option.textContent=toko;

if(filterToko==toko){

option.selected=true;

}

select.appendChild(option);

});

// ===============================
// MULAI LOOP DATA
// ===============================

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

// ===============================
// FILTER TANGGAL
// ===============================

if(filterTanggal){

let tgl = cols[tanggalIndex].trim();

if(tgl){

let p = tgl.split("-");

if(p.length==3){

const bulan={
jan:"01",
feb:"02",
mar:"03",
apr:"04",
may:"05",
jun:"06",
jul:"07",
aug:"08",
sep:"09",
oct:"10",
nov:"11",
dec:"12"
};

let tanggal=p[0].padStart(2,"0");
let bulanAngka=bulan[p[1].toLowerCase()];
let tahun=p[2];

let hasil=`${tahun}-${bulanAngka}-${tanggal}`;

if(hasil!==filterTanggal){
continue;
}

}

}

}

// ===============================
// FILTER TOKO
// ===============================

if(filterToko!=""){

if(cols[kodeIndex].trim()!=filterToko){

continue;

}

}

// ===============================
// HITUNG DASHBOARD
// ===============================

totalPending++;

totalQty += Number(cols[qtyIndex]) || 0;

if(
cols[penangananIndex] &&
cols[penangananIndex].trim().toUpperCase()=="REFUND"
){

totalRefund++;

}

// ===============================
// TABEL
// ===============================

const tr=document.createElement("tr");

tr.innerHTML=`

<td>${cols[tanggalIndex]}</td>

<td>${cols[kodeIndex]}</td>

<td>${cols[namaIndex]}</td>

<td>${cols[orderIndex]}</td>

<td>${cols[customerIndex]}</td>

<td>${cols[qtyIndex]}</td>

<td>${cols[penangananIndex]}</td>

`;

tbody.appendChild(tr);

}

// ===============================
// UPDATE CARD
// ===============================

document.getElementById("pending").textContent=totalPending;

document.getElementById("refund").textContent=totalRefund;

document.getElementById("qty").textContent=totalQty;

document.getElementById("toko").textContent=daftarToko.size;

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
            label: "Jumlah",
            data: [totalPending, totalRefund],
            backgroundColor: [
                "#f59e0b",
                "#10b981"
            ],
            borderRadius: 8
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

}); // selesai fetch
} // selesai function loadData()

// ===============================
// LOAD PERTAMA
// ===============================

loadData();

// ===============================
// TOMBOL FILTER
// ===============================

document.getElementById("btnFilter").addEventListener("click", loadData);

// ===============================
// SEARCH TABEL
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
// MENU DASHBOARD
// ===============================

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
