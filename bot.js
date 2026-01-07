console.log("✅ bot.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const botBtn = document.getElementById("botBtn");
  const botModal = document.getElementById("botModal");
  const botClose = document.getElementById("botClose");

  console.log("elements:", { botBtn, botModal, botClose });

  if (!botBtn) {
    console.error("Missing #botBtn");
    return;
  }

  // If modal isn't present yet, don't crash — just prove click works.
  if (!botModal || !botClose) {
    botBtn.addEventListener("click", () => {
      alert("Bot button works. Modal HTML not added yet.");
    });
    return;
  }

  function openBot() {
    botModal.classList.add("open");
    botModal.setAttribute("aria-hidden", "false");
  }

  function closeBot() {
    botModal.classList.remove("open");
    botModal.setAttribute("aria-hidden", "true");
  }

  botBtn.addEventListener("click", openBot);
  botClose.addEventListener("click", closeBot);
});
