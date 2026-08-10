document.getElementById("accessForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const status = document.getElementById("status");
  const email = document.getElementById("email").value.trim();

  status.textContent = "Memproses...";

  try {
    const response = await fetch(
      `${PAWTAG_CONFIG.FUNCTIONS_URL}/request-access`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const result = await response.json();
    status.textContent =
      result.message || "Jika email terdaftar, link akses akan dikirim.";
  } catch {
    status.textContent = "Tidak dapat terhubung ke server.";
  }
});
