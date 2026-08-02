// =============================
// URL GOOGLE APPS SCRIPT
// GANTI DENGAN URL WEB APP KAMU
// =============================

const API_URL = "MASUKKAN_URL_APPS_SCRIPT_DISINI";


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
