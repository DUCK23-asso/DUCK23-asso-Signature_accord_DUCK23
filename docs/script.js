// frontend/script.js

document.getElementById("signatureForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const discord = document.getElementById("discord").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;
  const date = document.getElementById("date").value;

  // --- Nouveau : récupérer les réponses aux questions Duck23 ---
  const statut = document.querySelector('input[name="statut"]:checked')?.value || "";

  const objectifs = Array.from(document.querySelectorAll('input[name="objectifs[]"]:checked')).map((el) => el.value);

  const participation = document.querySelector('input[name="participation"]:checked')?.value || "";

  const experience = document.querySelector('input[name="experience"]:checked')?.value || "";

  showToast("📄 Génération du PDF en cours...", "info");

  try {
    const response = await fetch("https://duck23-asso-signature-accord-duck23.onrender.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        discord,
        email,
        city,
        date,
        statut,
        objectifs,
        participation,
        experience
      }),
    });

    if (!response.ok) {
      throw new Error("Une erreur est survenue lors de la génération du PDF.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Engagement_${lastname}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    showToast("✅ PDF généré et envoyé avec succès !", "success");
  } catch (error) {
    showToast("❌ Une erreur est survenue : " + error.message, "error");
  }
});

// Fonction de toast notification
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.className = `toast visible ${type}`;
  setTimeout(() => {
    toast.className = "toast hidden";
  }, 4000);
}
