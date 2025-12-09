const BOT_NAME = "IYAOAA Assistant";
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

// Chat UI Elements
const chatBtn = document.getElementById("chatgpt-toggle");
const chatBox = document.getElementById("chatgpt-box");
const chatSend = document.getElementById("chatgpt-send");
const chatInput = document.getElementById("chatgpt-input");
const chatMessages = document.getElementById("chatgpt-messages");

// Toggle chat window
chatBtn.addEventListener("click", () => {
  chatBox.classList.toggle("open");
});

// Send message
chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  addMessage("You", userText);
  chatInput.value = "";

  addMessage(BOT_NAME, "Typing...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a friendly tech assistant for IYAOAA.com. Give simple, practical instructions." },
          { role: "user", content: userText }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Error: No reply";

    updateLastMessage(botReply);

  } catch (err) {
    updateLastMessage("Oops! Something went wrong.");
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateLastMessage(text) {
  const msgs = document.querySelectorAll(".chat-msg");
  msgs[msgs.length - 1].innerHTML = `<strong>${BOT_NAME}:</strong> ${text}`;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
