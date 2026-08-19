# Customer Service Chatbot — Demo (Praktisch onderzoek)

Rule-based chatbot prototype gebouwd met **HTML, CSS en vanilla JavaScript**, ontwikkeld als praktisch luik van het hybride onderzoek *"Kan een chatbot taken vervangen zoals support of customer service?"*.

## Project uitvoeren

Geen installatie, build-tools of externe libraries nodig.

1. Clone deze repository.
2. Open `index.html` rechtstreeks in een browser (dubbelklikken volstaat), of serveer de map lokaal (bv. VS Code Live Server).
3. Typ een vraag in het invoerveld en klik op **Verstuur**, of klik op **"Voer automatische tests uit"** om de 5 testcases automatisch te laten lopen.

## Bestandsstructuur

```
├── index.html      → structuur van de pagina, chatinterface en resultatentabel
├── style.css        → styling van chat, tabel en layout
├── script.js         → alle logica (zie hieronder)
└── README.md
```

## Belangrijkste functies (script.js)

| Functie | Beschrijving |
|---|---|
| `getBotResponse(userText)` | Kern van de chatbot. Doet keyword-matching op de gebruikersinput (bv. "wachtwoord", "bestelling", "retour", "klacht", "abonnement") en geeft een vooraf gedefinieerd antwoord + een confidence-score terug. Geeft een fallback-antwoord als geen keyword herkend wordt. |
| `appendMessage(sender, text)` | Voegt een chatbericht (van "user" of "bot") toe aan de chatbox in de DOM. |
| `saveLog(entry)` | Slaat elk gesprek (user- en bot-berichten met timestamp) op in `localStorage` onder de key `chatbot_logs_v1`, voor latere analyse. |
| `evaluateResponse(test, botAnswer)` | Vergelijkt het antwoord van de bot met de verwachte keywords van een testcase en berekent een nauwkeurigheidsscore: **Hoog** (≥80% keyword-match), **Gemiddeld** (≥40%), of **Laag** (<40%). |
| `runTests()` | Voert automatisch de 5 vooraf gedefinieerde testcases (`testcases` array) uit, toont elk gesprek in de chat, roept `evaluateResponse()` aan per test, en vult de resultatentabel + gemiddelde score in. |
| `escapeHtml(unsafe)` | Voorkomt HTML-injectie bij het weergeven van bot-antwoorden in de resultatentabel. |

## Testcases en resultaten

De 5 testcases in `script.js` (array `testcases`) dekken de belangrijkste scenario's uit het theoretisch onderzoek: wachtwoord reset, bestelstatus, abonnementsadvies, klachtafhandeling en retourproces.

Bij het uitvoeren van `runTests()` (via de knop in de UI) haalt de chatbot momenteel een **gemiddelde nauwkeurigheid van 90%**, met alle 5 testcases in de categorie "Hoog". Dit resultaat is reproduceerbaar: elke keer de tests draaien geeft hetzelfde resultaat, aangezien de chatbot deterministisch is (geen AI/randomness).

## Beperkingen

- Rule-based aanpak: werkt enkel bij herkende keywords, geen begrip van context of nuance.
- Geen echte empathie: de klachtenafhandeling herkent het onderwerp, maar kan geen emotionele nuance tonen — dit sluit aan bij de theoretische bevinding dat menselijke tussenkomst nodig blijft bij complexe/empathische vragen (zie hoofdverslag).
- Logging gebeurt lokaal (`localStorage`) en is dus per browser/apparaat, niet centraal.

## Gebruikte bronnen / tools

- Geen externe libraries of frameworks — pure HTML/CSS/JS.
