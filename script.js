const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let chart;

loadData();

document.getElementById("btnFilter").addEventListener("click", loadData);

function loadData() {

fetch(url)
.then(res => res.text())
.then(text => {

const rows = text.trim().split("\n");
const headers = rows[0].split(",");

const tanggalIndex = headers.indexOf("TGL ORDER");
const kodeIndex = headers.indexOf("KODE TOKO");
const namaIndex = headers.indexOf("NAMA TOKO");
const orderIndex = headers.indexOf("NO ORDER");
const customerIndex = headers.indexOf("CUSTOMER");
const qtyIndex = headers.indexOf("QTY");
const penangananIndex = headers.indexOf("PENANGANAN");

const filterTanggal = document.getElementById("filterTanggal").value;
const filterToko = document.getElementById("filterToko").value;

let totalPending = 0;
let totalRefund = 0;
let totalQty = 0;

const toko = new Set();

const tbody = document.querySelector("#dataTable tbody");
tbody.innerHTML = "";

const select = document.getElementById("filterToko");

select.innerHTML = '<option value="">Semua Toko</option>';

for(let i=1;i<rows.length;i++){

const cols = rows[i].split(",");

if(cols[kodeIndex]){
toko.add(cols[kodeIndex].trim());
}

}

Array.from(toko).sort().forEach(kode=>{

const option=document.createElement("option");
option.value=kode;
option.textContent=kode;

if(kode===filterToko){
option.selected=true;
}

select.appendChild(option);

});

const tokoHitung=new Set();

for(let i=1;i<rows.length;i++){

const cols=rows[i].split(",");

if(filterTanggal){

const tgl=new Date(cols[tanggalIndex]);
const tglData=tgl.toISOString().split("T")[0];

if(tglData!==filterTanggal){
continue;
}

}

if(filterToko && cols[kodeIndex].trim()!=filterToko){
continue;
}

totalPending++;

tokoHitung.add(cols[kodeIndex]);

totalQty+=Number(cols[qtyIndex])||0;

if(cols[penangananIndex].trim().toUpperCase()=="REFUND"){
totalRefund++;
}

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

document.getElementById("pending").textContent=totalPending;
document.getElementById("refund").textContent=totalRefund;
document.getElementById("qty").textContent=totalQty;
document.getElementById("toko").textContent=tokoHitung.size;

if(chart){
chart.destroy();
}

chart=new Chart(document.getElementById("myChart"),{

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

document.getElementById("searchInput").addEventListener("keyup",function(){

const keyword=this.value.toLowerCase();

const rows=document.querySelectorAll("#dataTable tbody tr");

rows.forEach(function(row){

if(row.innerText.toLowerCase().includes(keyword)){
row.style.display="";
}else{
row.style.display="none";
}

});

});
