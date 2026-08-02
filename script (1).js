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

    const result = [];
    let row = [];
    let value = "";
    let insideQuote = false;

    for(let i=0;i<text.length;i++){

        let char = text[i];

        if(char === '"'){
            insideQuote = !insideQuote;
        }
        else if(char === "," && !insideQuote){

            row.push(value);
            value="";

        }
        else if(char === "\n" && !insideQuote){

            row.push(value);
            result.push(row);

            row=[];
            value="";

        }
        else{

            value += char;

        }

    }

    row.push(value);
    result.push(row);

    return result;

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


const rows = parseCSV(csv);


if(rows.length < 2){

alert("Data Google Sheet kosong");

return;

}



const headers = rows[0].map(x =>
x.trim().toUpperCase()
);



console.log("HEADER:",headers);



function cariHeader(nama){

return headers.findIndex(h =>
h.includes(nama)
);

}


const idxTanggal = cariHeader("TGL");
const idxKode = cariHeader("KODE");
const idxNama = cariHeader("NAMA TOKO");
const idxOrder = cariHeader("ORDER");
const idxCustomer = cariHeader("CUSTOMER");
const idxQty = cariHeader("QTY");
const idxStatus = cariHeader("PENANGANAN");



allData=[];



for(let i=1;i<rows.length;i++){


let col = rows[i];


if(col.length < 3) continue;



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
// FILTER TOKO
// ======================================

function isiFilterToko(){

const select =
document.getElementById("filterToko");


let toko =
[...new Set(allData.map(x=>x.kode))]
.filter(x=>x)
.sort();



select.innerHTML =
`<option value="">Semua Toko</option>`;


toko.forEach(t=>{


let option =
document.createElement("option");


option.value=t;

option.textContent=t;


select.appendChild(option);


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
data.length;



let refund =
data.filter(x=>

x.status
.toUpperCase()
.includes("REFUND")

).length;




let qty =
data.reduce((a,b)=>a+b.qty,0);



let tokoJumlah =
new Set(data.map(x=>x.kode)).size;



document.getElementById("pending").innerHTML=pending;

document.getElementById("refund").innerHTML=refund;

document.getElementById("qty").innerHTML=qty;

document.getElementById("toko").innerHTML=tokoJumlah;



document.getElementById("lastUpdate").innerHTML=

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
// EVENT
// ======================================

document
.getElementById("btnFilter")
.onclick=filterData;



document
.getElementById("filterToko")
.onchange=filterData;



document
.getElementById("searchInput")
.onkeyup=function(){


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


};




// ======================================
// MENU
// ======================================

document
.getElementById("btnDashboard")
.onclick=function(){

dashboardPage.style.display="block";

dataPage.style.display="none";

};



document
.getElementById("btnData")
.onclick=function(){

dashboardPage.style.display="none";

dataPage.style.display="block";

};



// ======================================
// START
// ======================================

loadData();
