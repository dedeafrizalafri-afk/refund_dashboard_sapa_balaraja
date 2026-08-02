
});
// =====================================
// AUTO REFRESH
// =====================================

setInterval(() => {

    loadData();

}, 60000);

// =====================================
// LOAD AWAL
// =====================================

loadData();

// =====================================
// ERROR HANDLER
// =====================================

window.addEventListener("error", function (e) {

    console.error("JavaScript Error :", e.message);

});

// =====================================
// SELESAI
// =====================================
// =====================================
// ISI DROPDOWN TOKO
// =====================================

function isiFilterToko(){

const select =
document.getElementById("filterToko");


const current =
select.value;


const daftar =
[...new Set(allData.map(item=>item.kode))]
.filter(x=>x!=="")
.sort();



select.innerHTML =
`
<option value="">
Semua Toko
</option>
`;



daftar.forEach(kode=>{


const option =
document.createElement("option");


option.value=kode;

option.textContent=kode;



if(kode===current){

option.selected=true;

}



select.appendChild(option);


});


}




// =====================================
// FILTER DATA
// =====================================

function filterData(){


const toko =
document.getElementById("filterToko").value;


const status =
document.getElementById("filterStatus").value;


let hasil=[...allData];



if(toko){

hasil =
hasil.filter(item=>item.kode===toko);

}



if(status){

hasil =
hasil.filter(item=>item.status===status);

}



// =====================================
// HITUNG DASHBOARD
// =====================================


// SEMUA DATA = TOTAL PENDING

const totalPending =
hasil.length;



const totalRefund =
hasil.filter(item=>
item.status==="REFUND"
).length;



const totalKirimUlang =
hasil.filter(item=>
item.status==="KIRIM ULANG"
).length;



const totalQty =
hasil.reduce(
(total,item)=>total+item.qty,
0
);



const totalToko =
new Set(
hasil.map(item=>item.kode)
).size;



// UPDATE CARD


document.getElementById("pending").innerText =
totalPending.toLocaleString("id-ID");


document.getElementById("refund").innerText =
totalRefund.toLocaleString("id-ID");


document.getElementById("kirimUlang").innerText =
totalKirimUlang.toLocaleString("id-ID");


document.getElementById("qty").innerText =
totalQty.toLocaleString("id-ID");


document.getElementById("toko").innerText =
totalToko.toLocaleString("id-ID");



document.getElementById("lastUpdate").innerText =
"Last Update : "+
new Date().toLocaleString("id-ID");



tampilkanTabel(hasil);


buatChart(
totalPending,
totalRefund,
totalKirimUlang
);


}




// =====================================
// TABEL
// =====================================

function tampilkanTabel(data){


const tbody =
document.querySelector("#dataTable tbody");


tbody.innerHTML="";



data.forEach(item=>{


let badge="";



if(item.status==="REFUND"){

badge=
`<span class="status-refund">
REFUND
</span>`;

}

else if(item.status==="KIRIM ULANG"){

badge=
`<span class="status-kirim">
KIRIM ULANG
</span>`;

}

else{

badge=
`<span class="status-pending">
PENDING
</span>`;

}




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


}





// =====================================
// GRAFIK
// =====================================

function buatChart(pending,refund,kirim){


const ctx =
document.getElementById("my
