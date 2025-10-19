const chatbox = document.getElementById('chatbox');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const runTestsBtn = document.getElementById('runTestsBtn');
const resultsBody = document.getElementById('resultsBody');
const summaryDiv = document.getElementById('summary');


function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`; // 'user' of 'bot'
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

