// ======================================
// REFUND DASHBOARD SAPA BALARAJA
// ======================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";


let allData = [];
let chart = null;


// ======================================
// PARSE CSV AMAN
// ======================================

function parseCSV(text){

    return text
    .trim()
    .split(/\r?\n/)
    .map(row =>
        row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map(x => x.replace(/^"|"$/g,"").trim())
    );

}



// ======================================
// LOAD DATA
// ======================================

async function loadData(){

try{


const response = await fetch(SHEET_URL);


if(!response.ok){

throw new Error("Google Sheet tidak bisa dibuka");

}



const csv = await response.text();


console.log("CSV:",csv.substring(0,300));



const rows = parseCSV(csv);



const headers = rows[0]
.map(x=>x.toUpperCase());



console.log("HEADER:",headers);





function getIndex(name){

return headers.indexOf(name);

}




const idxTanggal = getIndex("TGL ORDER");
const idxKode = getIndex("KODE TOKO");
const idxNama = getIndex("NAMA TOKO");
const idxOrder = getIndex("NO ORDER");
const idxQty = getIndex("QTY");
const idxCustomer = getIndex("NAMA CUSTOMER");
const idxStatus = getIndex("PENANGANAN");



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


let col = rows[i];



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



let toko = 
[...new Set(allData.map(x=>x.kode))]
.filter(x=>x);



toko.forEach(t=>{


let opt =
document.createElement("option");


opt.value=t;

opt.textContent=t;


select.appendChild(opt);


});


}





// ======================================
// FILTER DATA
// ======================================

function filterData(){


let data=[...allData];



let toko =
document.getElementById("filterToko").value;



if(toko){

data =
data.filter(x=>x.kode===toko);

}





let pending =
data.filter(x=>

x.status.toUpperCase()
.includes("PENDING")

).length;





let refund =
data.filter(x=>

x.status.toUpperCase()
.includes("REFUND")

).length;





let qty =
data.reduce(
(a,b)=>a+b.qty,
0
);





let totalToko =
new Set(
data.map(x=>x.kode)
).size;





document.getElementById("pending").innerHTML =
pending;


document.getElementById("refund").innerHTML =
refund;


document.getElementById("qty").innerHTML =
qty;


document.getElementById("toko").innerHTML =
totalToko;



document.getElementById("lastUpdate").innerHTML =
"Last Update : "+
new Date().toLocaleString("id-ID");





// TABLE

let tbody =
document.querySelector("#dataTable tbody");


tbody.innerHTML="";



data.forEach(item=>{


tbody.innerHTML += `

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





// CHART


let ctx =
document.getElementById("myChart");



if(chart){

chart.destroy();

}



chart =
new Chart(ctx,{

type:"bar",

data:{


labels:[

"Pending",
"Refund"

],


datasets:[{

label:"Jumlah",

data:[

pending,
refund

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


let key =
this.value.toLowerCase();



document
.querySelectorAll("#dataTable tbody tr")
.forEach(row=>{


row.style.display =

row.innerText
.toLowerCase()
.includes(key)

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
