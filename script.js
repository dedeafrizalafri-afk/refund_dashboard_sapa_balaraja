fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv")
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
    const toko = new Set();

    for (let i = 1; i < rows.length; i++) {

        const cols = rows[i].split(",");

        if (cols[kodeIndex]) {
            toko.add(cols[kodeIndex].trim());
        }

        // Filter Tanggal
        if (filterTanggal) {
            const tgl = new Date(cols[tanggalIndex]);
            const tglData = tgl.toISOString().split("T")[0];

            if (tglData !== filterTanggal) {
                continue;
            }
        }

        // Filter Toko
        if (filterToko && cols[kodeIndex].trim() !== filterToko) {
            continue;
        }

        totalPending++;

        totalQty += Number(cols[qtyIndex]) || 0;

        if (
            cols[penangananIndex] &&
            cols[penangananIndex].trim().toUpperCase() === "REFUND"
        ) {
            totalRefund++;
        }
    }

    document.getElementById("pending").textContent = totalPending;
    document.getElementById("refund").textContent = totalRefund;
    document.getElementById("qty").textContent = totalQty;
    document.getElementById("toko").textContent = toko.size;

    // Isi dropdown toko
    const select = document.getElementById("filterToko");

    if (select.options.length === 1) {
        toko.forEach(kode => {
            const option = document.createElement("option");
            option.value = kode;
            option.textContent = kode;
            select.appendChild(option);
        });
    }

    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Pending", "Refund"],
            datasets: [{
                label: "Jumlah",
                data: [totalPending, totalRefund],
                backgroundColor: [
                    "#f59e0b",
                    "#10b981"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

});
