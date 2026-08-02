
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
