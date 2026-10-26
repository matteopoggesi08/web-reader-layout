# Mail Reader — progetto GitHub

Interfaccia web in stile Outlook che visualizza ricerche e pagine web in forma testuale. È composta da:
- **GitHub Pages**: interfaccia (`index.html`)
- **Cloudflare Worker**: API backend (`worker.js`) che richiede al servizio Reader di recuperare i testi

> **Importante:** caricare solo `index.html` su GitHub Pages non basta. Per le ricerche e la conversione delle pagine in testo devi pubblicare anche `worker.js` come Worker e configurare l'URL nel lettore. L'accessibilità dipende dalla rete e dal servizio upstream; alcuni siti potrebbero non essere estraibili.

## 1. Pubblica il frontend su GitHub Pages
1. Crea un repository GitHub, ad esempio `mail-reader`.
2. Estrai lo ZIP e carica `index.html` nella cartella principale del repository.
3. Apri **Settings → Pages**.
4. In **Build and deployment**, scegli **Deploy from a branch**, seleziona `main` e `/(root)`, quindi salva.
5. Attendi la pubblicazione. GitHub mostrerà l'indirizzo del sito.

## 2. Pubblica il backend su Cloudflare Workers
1. Crea/accedi a un account Cloudflare.
2. Apri **Workers & Pages** e crea un Worker.
3. Incolla il contenuto di `worker.js` nell'editor del Worker e fai **Deploy**.
4. Copia l'indirizzo HTTPS assegnato al Worker, per esempio `https://mail-reader-api.nome.workers.dev`.
5. Apri il sito GitHub Pages, premi **Imposta servizio** e incolla l'indirizzo del Worker.

### Chiave API (se richiesta dal servizio)
Il servizio upstream può richiedere una chiave API o applicare limiti. Se hai una chiave Jina:
- Nel pannello del Worker apri **Settings → Variables and Secrets**.
- Aggiungi un secret chiamato `JINA_API_KEY` con il valore della chiave.
- Non inserirla mai in `index.html` o in un repository pubblico.

## 3. Verifica il backend
Apri `https://TUO-WORKER.workers.dev/health`: dovrebbe mostrare `Mail Reader API is running.`
Poi prova `https://TUO-WORKER.workers.dev/search?q=calcio`. Se restituisce un errore, controlla l'eventuale chiave API, i limiti del servizio e l'accessibilità del servizio upstream.

## Uso
- Scrivi una ricerca nella barra in alto e premi **Cerca**.
- Clicca su **Leggi in testo** per aprire un risultato nel pannello.
- I link riconosciuti vengono aperti nello stesso lettore.
- Le immagini vengono omesse dalla resa Markdown.

## Privacy e sicurezza
- Il backend inoltra le query e gli URL richiesti al servizio esterno di estrazione.
- Non inserire credenziali o informazioni riservate nelle ricerche.
- Il lettore non garantisce anonimato: browser, rete aziendale e servizi intermedi possono registrare le richieste.
- Usa lo strumento nel rispetto delle regole e delle policy della tua organizzazione.
- Non è un browser completo: siti con login, contenuti dinamici, paywall o protezioni anti-bot potrebbero non essere disponibili.

## File
- `index.html`: frontend statico per GitHub Pages
- `worker.js`: backend da pubblicare come Cloudflare Worker
- `README.md`: istruzioni
