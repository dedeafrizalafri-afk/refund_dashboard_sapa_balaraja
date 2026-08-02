// ======================================
// REFUND DASHBOARD SAPA BALARAJA
// ======================================

const SHEET_URL = https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv


let allData = [];
let chart = null;


// ======================================
// LOAD DATA GOOGLE SHEET
// ======================================

async function loadData(){

try{


const response = await fetch(SHEET_URL);


const csv = await response.text();


console.log("CSV DATA:",csv);



const rows = csv
.trim()
.split("\n");



const headers = rows[0]
.split(",")
.map(x=>x.trim().toUpperCase());



console.log("HEADER:",headers);



// CARI KOLOM

const idxTanggal = headers.indexOf("TGL ORDER");
const idxKode = headers.indexOf("KODE TOKO");
const idxNama = headers.indexOf("NAMA TOKO");
const idxOrder = headers.indexOf("NO ORDER");
const idxQty = headers.indexOf("QTY");
const idxCustomer = headers.indexOf("NAMA CUSTOMER");
const idxStatus = headers.indexOf("PENANGANAN");



console.log({

tanggal:idxTanggal,
kode:idxKode,
nama:idxNama,
order:idxOrder,
qty:idxQty,
customer:idxCustomer,
status:idxStatus

});





allData=[];



for(let i=1;i<rows.length;i++){


const col = rows[i].split(",");



if(col.length < 5) continue;



allData.push({

tanggal: col[idxTanggal] || "",

kode: col[idxKode] || "",

nama: col[idxNama] || "",

order: col[idxOrder] || "",

qty: Number(col[idxQty]) || 0,

customer: col[idxCustomer] || "",

status: col[idxStatus] || ""


});



}



console.log("TOTAL DATA:",allData.length);



isiFilterToko();

filterData();



}

catch(error){

console.error(error);

alert("Gagal mengambil data Google Sheet");

}


}





// ======================================
// DROPDOWN TOKO
// ======================================


function isiFilterToko(){


const select =
document.getElementById("filterToko");



select.innerHTML =
`
<option value="">
Semua Toko
</option>
`;



const toko = [
...new Set(
allData.map(x=>x.kode)
)
];



toko.forEach(t=>{


let option =
document.createElement("option");


option.value=t;

option.textContent=t;


select.appendChild(option);


});


}





// ======================================
// FILTER & DASHBOARD
// ======================================


function filterData(){


let data=[...allData];



const toko =
document.getElementById("filterToko").value;



if(toko){

data =
data.filter(x=>x.kode===toko);

}





const totalPending =
data.filter(x=>

x.status
.toUpperCase()
.includes("PENDING")

).length;





const totalRefund =
data.filter(x=>

x.status
.toUpperCase()
.includes("REFUND")

).length;





const totalQty =
data.reduce(
(a,b)=>a+b.qty,
0
);





const totalToko =
new Set(
data.map(x=>x.kode)
).size;





document.getElementById("pending").innerHTML =
totalPending;


document.getElementById("refund").innerHTML =
totalRefund;


document.getElementById("qty").innerHTML =
totalQty;


document.getElementById("toko").innerHTML =
totalToko;





document.getElementById("lastUpdate").innerHTML =
"Last Update : "+
new Date().toLocaleString("id-ID");





// ======================================
// TABEL
// ======================================


const tbody =
document.querySelector("#dataTable tbody");


tbody.innerHTML="";



data.forEach(item=>{


tbody.innerHTML +=
`

<tr>

<td>${item.tanggal}</td>

<td>${item.kode}</td>

<td>${item.nama}</td>

<td>${item.order}</td>

<td>${item.customer}</td>

<td>${item.qty}</td>

<td>${item.status}</td>

</tr>

`;


});






// ======================================
// GRAFIK
// ======================================


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
"Refund"

],


datasets:[{

label:"Jumlah",

data:[

totalPending,
totalRefund

]

}]


},


options:{

responsive:true

}


});



}





// ======================================
// SEARCH
// ======================================


document
.getElementById("searchInput")
.addEventListener("keyup",function(){


let keyword =
this.value.toLowerCase();



document
.querySelectorAll("#dataTable tbody tr")
.forEach(row=>{


row.style.display =
row.innerText
.toLowerCase()
.includes(keyword)

?

""

:

"none";


});


});






// ======================================
// EVENT
// ======================================


document
.getElementById("btnFilter")
.onclick =
filterData;



document
.getElementById("filterToko")
.onchange =
filterData;







// ======================================
// MENU
// ======================================


document
.getElementById("btnDashboard")
.onclick=function(){


document.getElementById("dashboardPage").style.display="block";

document.getElementById("dataPage").style.display="none";


};




document
.getElementById("btnData")
.onclick=function(){


document.getElementById("dashboardPage").style.display="none";

document.getElementById("dataPage").style.display="block";


};





// ======================================
// START
// ======================================


loadData();
