const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let chart = null;

function loadData() {

fetch(url)
.then(res => res.text())
.then(text => {

const rows = text.trim().split("\n");
const headers = rows[0].split(",");

const tanggalIndex = headers.indexOf("TGL ORDER");
const kodeIndex = headers.indexOf("KODE TOKO");
const qtyIndex = headers.indexOf("QTY");
const penangananIndex = headers.indexOf("PENANGANAN");

const filterTanggal = document.getElementById("filterTanggal").value;
const filterToko = document.getElementById("filterToko").value;

let totalPending = 0;
let totalRefund = 0;
let totalQty = 0;

const daftarToko = new Set();

for(let i=1;i<rows.length;i++){

const cols = rows[i].split(",");

if(cols[kodeIndex]){
daftarToko.add(cols[kodeIndex].trim());
}

// Filter tanggal
if(filterTanggal){

let tgl = cols[tanggalIndex].trim();

if(tgl){
let p = tgl.split("-");

if(p.length==3){

let bulan={
jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",
jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"
};

let tanggal = p[0].padStart(2,"0");
let bulanAngka = bulan[p[1].toLowerCase()] || "01";
let tahun = p[2];

let hasil = `${tahun}-${bulanAngka}-${tanggal}`;

if(hasil!=filterTanggal){
continue;
}

}

}

}

// Filter toko
if(filterToko!=""){
if(cols[kodeIndex].trim()!=filterToko){
continue;
}
}

totalPending++;

totalQty += Number(cols[qtyIndex]) || 0;

if(cols[penangananIndex] &&
cols[penangananIndex].trim().toUpperCase()=="REFUND"){
totalRefund++;
}

}

// isi dropdown toko
const select=document.getElementById("filterToko");

if(select.options.length==1){

Array.from(daftarToko)
.sort()
.forEach(kode=>{

let option=document.createElement("option");
option.value=kode;
option.textContent=kode;

select.appendChild(option);

});

}

document.getElementById("pending").textContent=totalPending;
document.getElementById("refund").textContent=totalRefund;
document.getElementById("qty").textContent=totalQty;
document.getElementById("toko").textContent=daftarToko.size;

const ctx=document.getElementById("myChart");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{
type:"bar",
data:{
labels:["Pending","Refund"],
datasets:[{
label:"Jumlah",
data:[totalPending,totalRefund],
backgroundColor:[
"#f59e0b",
"#10b981"
]
}]
},
options:{
responsive:true,
plugins:{
legend:{
display:false
}
}
}
});

});
}

loadData();

document.getElementById("btnFilter").addEventListener("click",loadData);
