// Public URL of your Cloudflare Worker
const WORKER_URL = "https://clarusigna-bot-worker.hapincham.workers.dev";

// Grab DOM elements
const botBtn = document.getElementById("botBtn");
const botModal = document.getElementById("botModal");
const botClose = document.getElementById("botClose");
const botMessages = document.getElementById("botMessages");
const botForm = document.getElementById("botForm");
const botInput = document.getElementById("botInput");

const messages = [];

// Open / close modal
botBtn.addEventListener("click", () => {
  botModal.classList.add("open");
  botModal.setAttribute("aria-hidden", "false");
  botInput.focus();
});

botClose.addEventListener("click", () => {
  botModal.classList.remove("open");
  botModal.setAttribute("aria-hidden", "true");
});

// Render message
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  botMessages.appendChild(div);
  botMessages.scrollTop = botMessages.scrollHeight;
}

// Send message
async function sendToBot(text) {
  messages.push({ role: "user", content: text });
  addMessage("user", text);

  const typing = document.createElement("div");
  typing.className = "msg assistant";
  typing.textContent = "…";
  botMessages.appendChild(typing);

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      systemPrompt:
        "You are the ClaruSigna assistant. Be concise, thoughtful, and practical."
    })
  });

  const data = await res.json();
  typing.remove();

  messages.push({ role: "assistant", content: data.text });
  addMessage("assistant", data.text);
}

// Form submit
botForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = botInput.value.trim();
  if (!text) return;
  botInput.value = "";
  sendToBot(text).catch(() =>
    addMessage("assistant", "Something went wrong.")
  );
});
