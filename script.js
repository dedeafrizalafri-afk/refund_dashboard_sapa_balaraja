fetch("data.csv")
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split("\n");

    // Buang baris header
    rows.shift();

    let pending = rows.length;
    let refund = 0;
    let qty = 0;
    const toko = new Set();

    rows.forEach(row => {
      const cols = row.split(",");

      // Sesuaikan indeks kolom jika urutannya berbeda
      const kodeToko = cols[0]?.trim();
      const qtyValue = parseInt(cols[2]) || 0;
      const penanganan = cols[3]?.trim().toUpperCase();

      qty += qtyValue;

      if (penanganan === "REFUND") {
        refund++;
      }

      if (kodeToko) {
        toko.add(kodeToko);
      }
    });

    document.getElementById("pending").textContent = pending;
    document.getElementById("refund").textContent = refund;
    document.getElementById("qty").textContent = qty;
    document.getElementById("toko").textContent = toko.size;
  })
  .catch(err => console.error(err));
