console.log("✅ bot.js loaded (modal stage)");

document.addEventListener("DOMContentLoaded", () => {
  const botBtn = document.getElementById("botBtn");
  const botModal = document.getElementById("botModal");
  const botClose = document.getElementById("botClose");

  if (!botBtn || !botModal || !botClose) {
    console.error("Missing bot elements:", { botBtn, botModal, botClose });
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
  botModal.addEventListener("click", (e) => {
    if (e.target === botModal) closeBot();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBot();
  });
});
