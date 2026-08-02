// =============================
// URL GOOGLE APPS SCRIPT
// GANTI DENGAN URL WEB APP KAMU
// =============================

const API_URL = "https://docs.google.com/spreadsheets/d/e/2pacx-1vs169srv3rdfs6jafzotcl9qklxph0aki6jt-2roydlysktddjy2kq0znqtfhf_ivctljjyxxdbnlbm/pub?gid=463015523&single=true&output=csv ;);";


let allData = [];
let chart;



// =============================
// LOAD DATA
// =============================

async function loadData(){

try{

const response = await fetch(https://docs.google.com/spreadsheets/d/e/2pacx-1vs169srv3rdfs6jafzotcl9qklxph0aki6jt-2roydlysktddjy2kq0znqtfhf_ivctljjyxxdbnlbm/pub?gid=463015523&single=true&output=csv ;);

const data = await response.json();

allData = data;


updateDashboard(data);

showTable(data);

setLastUpdate();


}
catch(error){

console.log("Gagal mengambil data :",error);

}

}



// =============================
// UPDATE CARD DASHBOARD
// =============================

function updateDashboard(data){


let pending = 0;
let refund = 0;
let qty = 0;

let toko = new Set();



data.forEach(item=>{


let status = String(item.Status || item.status || "")
.toUpperCase();



if(status=="PENDING"){

pending++;

}


if(status=="REFUND"){

refund++;

}



qty += Number(
item.Qty || item.qty || 0
);



toko.add(
item["Kode Toko"] ||
item.kode
// =============================
// GRAFIK
// =============================

if(chart){
    chart.destroy();
}


chart = new Chart(
document.getElementById("myChart"),
{

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

pending,

refund,

data.filter(x =>
String(x.Status || x.status || "")
.toUpperCase()=="KIRIM ULANG"
).length

]

}]

},


options:{

responsive:true

}

}

);



}


// =============================
// TAMPIL DATA TABEL
// =============================

function showTable(data){


const tbody =
document.querySelector("#dataTable tbody");


tbody.innerHTML="";



data.forEach(item=>{


let tr=document.createElement("tr");



tr.innerHTML=`

<td>${item.Tanggal || item.tanggal || "-"}</td>

<td>${item["Kode Toko"] || item.kode_toko || "-"}</td>

<td>${item["Nama Toko"] || item.nama_toko || "-"}</td>

<td>${item["No Order"] || item.no_order || "-"}</td>

<td>${item["Nama Customer"] || item.customer || "-"}</td>

<td>${item.Qty || item.qty || 0}</td>

<td>${item.Status || item.status || "-"}</td>

`;



tbody.appendChild(tr);


});


}



// =============================
// UPDATE WAKTU
// =============================

function setLastUpdate(){

document.getElementById("lastUpdate").innerHTML =

"Last Update : " +

new Date().toLocaleString("id-ID");


}



// =============================
// SEARCH
// =============================

document
.getElementById("searchInput")
.addEventListener("keyup",function(){


let keyword=this.value.toLowerCase();



let hasil = allData.filter(item=>{


return JSON.stringify(item)
.toLowerCase()
.includes(keyword);


});



showTable(hasil);


});




// =============================
// PINDAH HALAMAN
// =============================

document
.getElementById("btnDashboard")
.onclick=function(){


document.getElementById("dashboardPage")
.style.display="block";


document.getElementById("dataPage")
.style.display="none";


};



document
.getElementById("btnData")
.onclick=function(){


document.getElementById("dashboardPage")
.style.display="none";


document.getElementById("dataPage")
.style.display="block";


};




// =============================
// FILTER
// =============================

document
.getElementById("btnFilter")
.onclick=function(){


let toko =
document.getElementById("filterToko").value;


let status =
document.getElementById("filterStatus").value;



let hasil = allData.filter(item=>{


let cocokToko =
!toko ||
(item["Kode Toko"] || item.kode_toko)==toko;



let cocokStatus =
!status ||
String(item.Status || item.status)
.toUpperCase()==status;



return cocokToko && cocokStatus;


});



showTable(hasil);


};




// =============================
// JALANKAN SAAT BUKA
// =============================

loadData();
