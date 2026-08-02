    const totalQty =
        hasil.reduce((total, item) => total + item.qty, 0);

    const totalToko =
        new Set(hasil.map(item => item.kode)).size;

    // ==========================
    // UPDATE CARD
    // ==========================

    document.getElementById("pending").textContent =
        totalPending.toLocaleString("id-ID");

    document.getElementById("refund").textContent =
        totalRefund.toLocaleString("id-ID");

    document.getElementById("kirimUlang").textContent =
        totalKirimUlang.toLocaleString("id-ID");

    document.getElementById("qty").textContent =
        totalQty.toLocaleString("id-ID");

    document.getElementById("toko").textContent =
        totalToko.toLocaleString("id-ID");

    document.getElementById("lastUpdate").textContent =
        "Last Update : " +
        new Date().toLocaleString("id-ID");
        // =====================================
    // TABEL DATA
    // =====================================

    const tbody = document.querySelector("#dataTable tbody");

    tbody.innerHTML = "";

    hasil.forEach(item => {

        let badge = "";

        if (item.status === "REFUND") {

            badge =
            '<span class="status-refund">REFUND</span>';

        }

        else if (item.status === "KIRIM ULANG") {

            badge =
            '<span class="status-kirim">KIRIM ULANG</span>';

        }

        else {

            badge =
            '<span class="status-pending">PENDING</span>';

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

    // =====================================
    // GRAFIK
    // =====================================

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
                "Refund",
                "Kirim Ulang"
            ],

            datasets:[{

                label:"Jumlah",

                data:[
                    totalPending,
                    totalRefund,
                    totalKirimUlang
                ],

                backgroundColor:[
                    "#f59e0b",
                    "#22c55e",
                    "#3b82f6"
                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        precision:0

                    }

                }

            }

        }

    });

} // ===== AKHIR filterData() =====
// =====================================
// SEARCH DATA
// =====================================

document.getElementById("searchInput").addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

});

// =====================================
// EVENT FILTER
// =====================================

document.getElementById("btnFilter").addEventListener("click", filterData);

document.getElementById("filterDari").addEventListener("change", filterData);

document.getElementById("filterSampai").addEventListener("change", filterData);

document.getElementById("filterToko").addEventListener("change", filterData);

document.getElementById("filterStatus").addEventListener("change", filterData);

// =====================================
// MENU DASHBOARD
// =====================================

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
