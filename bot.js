console.log("✅ bot.js loaded (chat stage)");
console.log("🔥 bot.js CHAT STAGE v1 loaded");


const WORKER_URL = "https://clarusigna-bot-worker.hapincham.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const botBtn = document.getElementById("botBtn");
  const botModal = document.getElementById("botModal");
  const botClose = document.getElementById("botClose");

  const botMessages = document.getElementById("botMessages");
  const botForm = document.getElementById("botForm");
  const botInput = document.getElementById("botInput");

  if (!botBtn || !botModal || !botClose || !botMessages || !botForm || !botInput) {
    console.error("Missing bot elements:", {
      botBtn, botModal, botClose, botMessages, botForm, botInput
    });
    return;
  }

  const messages = [];

  function openBot() {
    botModal.classList.add("open");
    botModal.setAttribute("aria-hidden", "false");
    botInput.focus();

    // Optional: greet once per page load
    if (botMessages.childElementCount === 0) {
      addBubble("assistant",
        "Hi — I’m the ClaruSigna Bot. Ask me about Howard’s work, projects, or how he can help."
      );
    }
  }

  function closeBot() {
    botModal.classList.remove("open");
    botModal.setAttribute("aria-hidden", "true");
  }

  botBtn.addEventListener("click", openBot);
  botClose.addEventListener("click", closeBot);
  botModal.addEventListener("click", (e) => { if (e.target === botModal) closeBot(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBot(); });

  function addBubble(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `bot-bubble ${role}`;
    wrap.textContent = text;
    botMessages.appendChild(wrap);
    botMessages.scrollTop = botMessages.scrollHeight;
    return wrap;
  }

  async function askBot(userText) {
    // Keep a short rolling history (client-side)
    messages.push({ role: "user", content: userText });
    if (messages.length > 20) messages.splice(0, messages.length - 20);

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          systemPrompt:
            "You are Clarus, the ClaruSigna assistant.\n\n" +
            "CRITICAL RULES:\n" +
            "- Your role is to answer questions using ONLY the documents and information provided about Howard Pincham and ClaruSigna.\n" +
            "- If you do not know something, say so plainly and ask a clarifying question.\n" +
            "- Do NOT invent projects, clients, credentials, or services.\n" +
            "- If a question cannot be answered directly from the provided documents, respond clearly:" +
            "- The provided information does not contain an answer to that question.\n" +
            "- Your purpose is accuracy and clarity, not completeness.\n\n" +
            "STYLE:\n" +
            "- Concise, thoughtful, practical\n" +
            "- Confident but not salesy\n" +
            "- Helpful to technically literate visitors\n",
        messages
      }),
    });

    // If CORS/origin blocks, you’ll see it here
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Worker error ${res.status}: ${t.slice(0, 200)}`);
    }

    const data = await res.json();
    return (data.text || "").trim();
  }

  botForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = botInput.value.trim();
    if (!userText) return;

    botInput.value = "";

    addBubble("user", userText);
    const typing = addBubble("assistant", "…");

    try {
      const reply = await askBot(userText);

      typing.remove();

      const finalReply = reply || "Hmm. I didn’t get anything back. Try again?";
      messages.push({ role: "assistant", content: finalReply });
      if (messages.length > 20) messages.splice(0, messages.length - 20);

      addBubble("assistant", finalReply);
    } catch (err) {
      console.error(err);
      typing.remove();
      addBubble("assistant", "Sorry — I couldn’t reach the bot backend. (Check console for details.)");
    }
  });
});
