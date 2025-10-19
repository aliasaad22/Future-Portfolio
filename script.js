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
    response.confidence = 0.75;
  } else if (text.includes('retour') || text.includes('retourneren') || text.includes('terugsturen')) {
    response.text = "Voor retourneren kunt u het retourformulier invullen in 'Mijn bestellingen'. Retourzendingen worden binnen 14 dagen verwerkt.";
    response.confidence = 0.85;
  } else if (text.includes('klacht') || text.includes('boos') || text.includes('klantenservice')) {
    response.text = "Het spijt me te horen dat u een slechte ervaring heeft. Ik kan uw klacht registreren en doorsturen naar een medewerker. Wilt u dat ik uw gegevens doorgeef?";
    response.confidence = 0.4; // laag - empathie niet echt
  } else if (text.length < 3) {
    response.text = "Kunt u wat meer details geven? Bijvoorbeeld 'Hoe reset ik mijn wachtwoord?'";
    response.confidence = 0.3;
  }

  return response;
}

 