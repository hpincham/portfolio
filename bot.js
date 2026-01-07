console.log("bot.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const botBtn = document.getElementById("botBtn");
  console.log("DOMContentLoaded. botBtn =", botBtn);

  if (!botBtn) {
    console.error("botBtn not found. Check the markup/IDs.");
    return;
  }
});

const WORKER_URL = "https://clarusigna-bot-worker.hapincham.workers.dev";

const botBtn = document.getElementById("botBtn");
const botModal = document.getElementById("botModal");
const botClose = document.getElementById("botClose");
const botMessages = document.getElementById("botMessages");
const botForm = document.getElementById("botForm");
const botInput = document.getElementById("botInput");

const messages = [];

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  botMessages.appendChild(div);
  botMessages.scrollTop = botMessages.scrollHeight;
}

function openBot() {
  botModal.classList.add("open");
  botModal.setAttribute("aria-hidden", "false");
  botInput.focus();
}

function closeBot() {
  botModal.classList.remove("open");
  botModal.setAttribute("aria-hidden", "true");
}

botBtn.addEventListener("click", () => {
  console.log("Bot button clicked");
  openBot();
});
botClose.addEventListener("click", closeBot);
botModal.addEventListener("click", (e) => {
  if (e.target === botModal) closeBot();
});

botForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = botInput.value.trim();
  if (!text) return;

  botInput.value = "";
  messages.push({ role: "user", content: text });
  addMessage("user", text);

  const typing = document.createElement("div");
  typing.className = "msg assistant";
  typing.textContent = "…";
  botMessages.appendChild(typing);
  botMessages.scrollTop = botMessages.scrollHeight;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt:
          "You are the ClaruSigna website assistant. Help visitors understand Howard Pincham’s work, projects, and services. Be concise, practical, and friendly. Ask one clarifying question when needed.",
        messages,
      }),
    });

    const data = await res.json();
    typing.remove();

    const reply = data.text || "(No response)";
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
  } catch {
    typing.remove();
    addMessage("assistant", "Sorry—something went sideways.");
  }
});
