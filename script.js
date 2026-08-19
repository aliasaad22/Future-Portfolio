
const chatbox = document.getElementById('chatbox');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const runTestsBtn = document.getElementById('runTestsBtn');
const resultsBody = document.getElementById('resultsBody');
const summaryDiv = document.getElementById('summary');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}


function getBotResponse(userText) {

  const text = userText.trim().toLowerCase();

  
  let response = {
    text: "Sorry, ik begrijp je vraag niet. Kun je het anders formuleren?",
    confidence: 0 
  };

  if (text.includes('wachtwoord') || text.includes('reset')) {
    response.text = "U kunt uw wachtwoord resetten via de knop 'Wachtwoord vergeten' op de loginpagina. U ontvangt daarna een e-mail met een reset-link.";
    response.confidence = 0.95;
  } else if (text.includes('bestelling') || text.includes('order') || text.includes('tracking')) {
    response.text = "U kunt de status van uw bestelling controleren door in te loggen op 'Mijn account' en naar 'Bestellingen' te gaan. Heeft u uw ordernummer bij de hand?";
    response.confidence = 0.9;
  } else if (text.includes('abonnement') || text.includes('plan') || text.includes('pakket')) {
    response.text = "We hebben drie abonnementen: Basic (basisfuncties), Premium (extra's) en Pro (volledige functionaliteit). Welke features zoekt u?";
    response.confidence = 0.85;
  } else if (text.includes('retour') || text.includes('retourneren') || text.includes('terugsturen')) {
    response.text = "Voor retourneren kunt u het retourformulier invullen in 'Mijn bestellingen'. Retourzendingen worden binnen 14 dagen verwerkt.";
    response.confidence = 0.9;
  } else if (text.includes('klacht') || text.includes('boos') || text.includes('klantenservice')) {
    response.text = "Het spijt me te horen dat u een slechte ervaring heeft. Ik kan uw klacht registreren en doorsturen naar een medewerker. Wilt u dat ik uw gegevens doorgeef?";
    response.confidence = 0.7; // laag - empathie niet echt
  } else if (text.length < 3) {
    response.text = "Kunt u wat meer details geven? Bijvoorbeeld 'Hoe reset ik mijn wachtwoord?'";
    response.confidence = 0.3;
  }

  return response;
}


sendBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  appendMessage('user', text);
  input.value = '';
  
  setTimeout(() => {
    const botResp = getBotResponse(text);
    appendMessage('bot', botResp.text);
    saveLog({ sender: 'user', text: text, time: new Date().toISOString() });
    saveLog({ sender: 'bot', text: botResp.text, confidence: botResp.confidence, time: new Date().toISOString() });
  }, 350);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});


function saveLog(entry) {
  try {
    const key = 'chatbot_logs_v1';
    const logs = JSON.parse(localStorage.getItem(key) || '[]');
    logs.push(entry);
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (err) {
    console.warn('Kon log niet opslaan', err);
  }
}


const testcases = [
  {
    name: 'Wachtwoord reset',
    input: 'Ik ben mijn wachtwoord vergeten, hoe reset ik dat?',
    expectedKeywords: ['reset', 'wachtwoord', 'link'],
    expected: 'Reset instructies correct'
  },
  {
    name: 'Bestelling status',
    input: 'Wat is de status van mijn bestelling #12345?',
    expectedKeywords: ['status', 'bestelling', 'mijn account'],
    expected: 'Status instructie gegeven'
  },
  {
    name: 'Abonnement advies',
    input: 'Welk abonnement is geschikt voor een kleine gebruiker?',
    expectedKeywords: ['abonnement', 'basic', 'premium', 'plan'],
    expected: 'Basisadvies'
  },
  {
    name: 'Klacht/compliment',
    input: 'Ik wil een klacht indienen over beschadigde levering.',
    expectedKeywords: ['klacht', 'sorry', 'medewerker'],
    expected: 'Menselijke empathie / doorverwijzing'
  },
  {
    name: 'Retourproces',
    input: 'Hoe retourneer ik een artikel?',
    expectedKeywords: ['retour', 'return', 'formulier', '14 dagen'],
    expected: 'Retourprocedure'
  }
];


function evaluateResponse(test, botAnswer) {
  const answer = botAnswer.text.toLowerCase();
  let matches = 0;
  test.expectedKeywords.forEach(k => {
    if (answer.includes(k)) matches++;
  });
  const ratio = matches / test.expectedKeywords.length;
  if (ratio >= 0.8) return { accuracy: 'Hoog', score: 0.9 };
  if (ratio >= 0.4) return { accuracy: 'Gemiddeld', score: 0.6 };
  return { accuracy: 'Laag', score: 0.2 };
}


async function runTests() {
  resultsBody.innerHTML = '';
  summaryDiv.textContent = 'Tests aan het uitvoeren...';
  let totalScore = 0;

  for (const t of testcases) {
    appendMessage('user', t.input);
    
    await new Promise(r => setTimeout(r, 250));
    const botResp = getBotResponse(t.input);
    appendMessage('bot', botResp.text);
    saveLog({ sender: 'user', text: t.input, time: new Date().toISOString() });
    saveLog({ sender: 'bot', text: botResp.text, time: new Date().toISOString() });

    
    const evalRes = evaluateResponse(t, botResp);
    totalScore += evalRes.score;

    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.expected}</td>
      <td>${escapeHtml(botResp.text)}</td>
      <td>${evalRes.accuracy}</td>
      <td>${evalRes.accuracy === 'Laag' ? 'Moet doorverwijzen naar medewerker' : ''}</td>
    `;
    resultsBody.appendChild(tr);

    await new Promise(r => setTimeout(r, 300));
  }

  const avg = totalScore / testcases.length;
  const pct = Math.round(avg * 100);
  summaryDiv.innerHTML = `Gemiddelde nauwkeurigheid (gesimuleerd): <strong>${pct}%</strong>. <br> Advies: gebruik chatbot voor eenvoudige taken; verwees complexe gevallen door naar mens.`;
}


function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


runTestsBtn.addEventListener('click', runTests);

(function init() {
  appendMessage('bot', 'Hallo! Ik ben de demo-chatbot. Stel een vraag of klik op "Voer automatische tests uit" om de testcases te runnen.');
})();
