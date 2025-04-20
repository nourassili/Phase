const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatLog = document.getElementById('chat-log');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  const userMsg = document.createElement('p');
  userMsg.textContent = "👩 You: " + userText;
  chatLog.appendChild(userMsg);

  const aiMsg = document.createElement('p');
  aiMsg.textContent = "🤖 Phase: (AI response goes here)";
  chatLog.appendChild(aiMsg);

  input.value = '';
});
