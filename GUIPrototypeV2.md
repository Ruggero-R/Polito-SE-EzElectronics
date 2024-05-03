# Graphical User Interface Prototype - FUTURE

Authors: Carlino Mattia, Coppola Neri Valerio, Mosca Alessandro, Rossino Ruggero

Date:

Version: 2.0.0

# Application GUI

| Functionality | Description | Image |
| ----------------- | ----------------- |:-----------:|
|Login| La pagina dedicata all'autenticazione degli utenti. | ![Login](images/gui/v2/StartLogin.png) |
|Register| Pagina relativa alla registrazione di un utente. | ![Registrazione](images/gui/v2/StartRegistrazione.png) |
|Home principale generica| La homepage nella sua versione base, senza alcun filtro per la visualizzazione dei prodotti in vendita. Ogni utente, anche non autenticato, può visualizzare la pagina. | ![HomePageNoRegister](images/gui/v2/homepage/HomeTuttiNoRegister.png) |
|Home principale utenti customer| La homepage nella sua versione base, senza alcun filtro per la visualizzazione dei prodotti in vendita. Ogni utente customer può visualizzare la pagina. | ![HomePageCustomer](images/gui/v2/homepage/HomeTuttiCustomer.png) |
|Home principale filtro "Non disponibili"| La homepage con il filtro applicato ("Non Disponibili") per visualizzare solo i prodotti terminati e quindi non acquistabili. | ![HomePageSoldYes](images/gui/v2/homepage/HomeNonDisponibili.png) |
|Home principale filtro "Disponibili"| La homepage con il filtro applicato ("Disponibili") per visualizzare solo i prodotti disponibili all'acquisto.| ![HomePageSoldNo](images/gui/v2/homepage/HomeDisponibili.png) |
|Smartphone| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Smartphone". | ![Smartphone](images/gui/v2/homepage/Smartphone.png) |
|Laptop| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Laptop". | ![Laptop](images/gui/v2/homepage/Laptop.png) |
|Elettrodomestici| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Elettrodomestici". | ![Elettrodomestici](images/gui/v2/homepage/Elettrodomestici.png) |
|Info profilo Customer| Pagina relativa alla visualizzazione del profilo di un utente customer. | ![InfoProfiloCustomer](images/gui/v2/profile/InfoProfiloCustomer.png) |
|Recensioni utente customer| Pagina relativa alla visualizzazione delle proprie recensioni da parte di un utente customer, accessibile dal profilo. | ![RecensioniCustomer](images/gui/v2/profile/InfoProfiloCustomerRecensioni.png) |
|Home principale utenti employee| La homepage che ogni utente employee visualizza dopo essersi autenticato. | ![HomePageEmployee](images/gui/v2/homepage/HomeEmployee.png) |
|Info profilo Employee| Pagina relativa alla visualizzazione del profilo di un utente employee. | ![InfoProfiloEmployee](images/gui/v2/profile/InfoProfiloEmployee.png) |
|Home principale utenti manager| La homepage che ogni utente manager visualizza dopo essersi autenticato. | ![HomePageManager](images/gui/v2/homepage/HomeManager.png) |
|Info profilo Manager| Pagina relativa alla visualizzazione del profilo di un utente manager. | ![InfoProfiloManager](images/gui/v2/profile/InfoProfiloManager.png) |
|Gestione modelli| Pagina, visualizzabile solo ad un utente employee o manager, relativa alla presentazione dei diversi modelli disponibili sul sito. | ![GestioneModelli](images/gui/v2/operation/GestioneModelli.png) |
|Gestione ordini| Pagina, visualizzabile solo ad un utente employee o manager, relativa alla presentazione dei diversi ordini presenti sul sito. | ![GestioneOrdini](images/gui/v2/operation/Ordini.png) |
|Ordine aperto| Pagina, visualizzabile solo ad un utente employee o manager, relativa alla presentazione dell'ordine selezionato dalla pagina di gestione degli ordini. In questa pagina l'employee o il manager possono vedere il riepilogo dei dati di un ordine e aggiornare lo stato di un ordine.  | ![OrdineAperto](images/gui/v2/operation/OrdineAperto.png) |
|Visualizzazione modello disponibile| Pagina relativa alla visualizzazione, da parte di un utente customer, di un modello disponibile e quindi idoneo all'acquisto all'interno del sito. | ![ModelloDisponibileCustomer](images/gui/v2/model/ModelloApertoDisponibile.png) |
|Visualizzazione prodotto terminato| Pagina relativa alla visualizzazione, da parte di un utente customer, di un modello terminato e quindi non idoneo all'acquisto all'interno del sito. | ![ModelloTerminatoCustomer](images/gui/v2/model/ModelloApertoTerminato.png) |
|Visualizzazione modello disponibile Manager| Pagina relativa alla visualizzazione, da parte di un utente manager o di un utente employee, di un singolo modello disponibile e quindi idoneo all'acquisto all'interno del sito. | ![ModelloDisponibileManager](images/gui/v2/model/ModelloApertoDisponibileManager.png) |
|Visualizzazione prodotto terminato Manager| Pagina relativa alla visualizzazione, da parte di un utente manager o di un utente employee, di un modello terminato e quindi non idoneo all'acquisto all'interno del sito. | ![ModelloTerminatoManager](images/gui/v2/model/ModelloApertoTerminatoManager.png) |
|Modifica prodotto disponibile Manager| Pagina, visualizzabile da parte di un utente manager o di un utente employee, predisposta per le modifiche dei dettagli relativi ad un modello in vendita. | ![ModificaProdottoDisponibileManager](images/gui/v2/model/ModelloApertoDisponibileManagerModifica.png) |
|Vista prodotti modello disponibile| Pagina, visualizzabile da parte di un utente manager o di un utente employee, che mostra i diversi prodotti disponibili di un determinato modello disponibile sul sito. | ![VistaProdottiModelloDisponibile](images/gui/v2/model/ModelloApertoDisponibileManagerTutti.png) |
|Vista prodotti modello terminato| Pagina, visualizzabile da parte di un utente manager o di un utente employee, che mostra i diversi prodotti disponibili di un determinato modello terminato sul sito. | ![VistaProdottiModelloTerminato](images/gui/v2/model/ModelloApertoTerminatoManagerTutti.png) |
|Carrello vuoto| Pagina relativa alla visualizzazione del carrello, da parte di un utente customer, nella condizione in cui nessun prodotto è stato inserito nel carrello. | ![CarrelloVuoto](images/gui/v2/cart/CarrelloVuoto.png) |
|Carrello pieno| Pagina relativa alla visualizzazione del carrello attuale, da parte di un utente customer, nella condizione in cui sono già stati aggiunti diversi prodotti nel carrello. | ![CarrelloPieno](images/gui/v2/cart/CarrelloPieno.png) |
|Checkout Ritiro| Pagina relativa alla visualizzazione di conferma di avvenuto checkout, da parte di un utente customer, del carrello con selezione opzione di ritiro dell'ordine presso il negozio. | ![CheckoutRitiro](images/gui/v2/checkout/CheckoutRitiro.png) |
|Checkout Spedizione| Pagina, visualizzata da un utente customer, di selezione e conferma dei dati per la spedizione dell'ordine. | ![CheckoutSpedizione](images/gui/v2/checkout/CheckoutSpedizione.png) |
|Checkout pagamento carta di credito| Pagina, visualizzata da un utente customer, di selezione e conferma dei dati per la spedizione dell'ordine con opzione di pagamento con carta di credito. | ![CheckoutPagamentoCarta](images/gui/v2/checkout/CheckoutSpedizioneCarta.png) |
|Checkout pagamento consegna| Pagina, visualizzata da un utente customer, di selezione e conferma dei dati per la spedizione dell'ordine con opzione di pagamento in contrassegno. | ![CheckoutPagamentoConsegna](images/gui/v2/checkout/CheckoutSpedizioneConsegna.png) |
|Checkout pagamento PayPal| Pagina, visualizzata da un utente customer, di selezione e conferma dei dati per la spedizione dell'ordine con opzione di pagamento con PayPal. | ![CheckoutPagamentoPayPal](images/gui/v2/checkout/CheckoutSpedizionePayPal.png) |
|Checkout pagamento Google Pay| Pagina, visualizzata da un utente customer, di selezione e conferma dei dati per la spedizione dell'ordine con opzione di pagamento con Google Pay. | ![CheckoutPagamentoGoogle](images/gui/v2/checkout/CheckoutSpedizioneGoogle.png) |
|Checkout reindirizzamento pagamento| Pagina alla quale viene reinderizzato un utente customer per il pagamento | ![CheckoutPagina](images/gui/v2/checkout/CheckoutSpedizionePagamento.png) |
|Cronologia carrelli vuota| Pagina relativa alla visualizzazione dello storico dei carrelli passati, da parte di un utente customer, nella condizione in cui non vi sia alcun carrello passato. | ![CronologiaCarrelliVuota](images/gui/v2/cart/CronologiaCarrelliVuota.png) |
|Carrello carrelli piena| Pagina relativa alla visualizzazione dello storico dei carrelli passati, da parte di un utente customer, nella condizione in cui vi siano uno o più carrelli passati. | ![CronologiaCarrelliPiena](images/gui/v2/cart/CronologiaCarrelli.png) |
|Carrello vecchio pieno| Pagina relativa alla visualizzazione del resoconto di un carrello, da parte di un utente customer, nella condizione in cui il checkout sia già stato effetuato. | ![CarrelloVecchioPieno](images/gui/v2/cart/CarrelloVecchioPieno.png) |
|New product| Pagina, visualizzabile solo dall'utente manager, relativa all'inserimento di un nuovo prodotto. | ![NewProduct](images/gui/v2/profile/NewProduct.png) |
|Visualizza tutti i prodotti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti presenti nel database. | ![VisualizzaProdottiTutti](images/gui/v2/profile/VisualizzaProdottiManagerTutti.png) |
|Visualizza tutti i prodotti venduti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti non disponibili presenti nel database. | ![VisualizzaProdottiVenduti](images/gui/v2/profile/VisualizzaProdottiManagerVenduti.png) |
|Visualizza tutti i prodotti non venduti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti disponibili presenti nel database. | ![VisualizzaProdottiNonVenduti](images/gui/v2/profile/VisualizzaProdottiManagerNonVenduti.png) |
|Footer| Barra di navigazione presente alla fine di ogni pagina diversa da quelle di autenticazione. Consente una user experience più piacevole. | ![Footer](images/gui/v2/footer.png) |

# Application GUI - Alert

**In questa tabella saranno riportati tutti gli alert collegati alla corretta funzionalità della GUI**

| Functionality | Description | Image |
| ----------------- | ----------------- |:-----------:|
| Alert credenziali errate | Un avviso a comparsa indicante l'inserimento errato nei campi di input durante il processo di login. | ![CredenzialiErrate](images/gui/v2/alert/AlertStartLoginErrore.png) |
| Alert campi non compilati | Un avviso a comparsa indicante la mancanza di input nei campi obbligatori durante il processo di registrazione. | ![CampiVuoti](images/gui/v2/alert/AlertStartRegistrazioneErrore.png) |
| Allegato file multimediale | Window che permette la selezione di un file multimediale da utilizzare come immagine del profilo dell'utente durante il processo di registrazione. | ![AllegatoFotoProfilo](images/gui/v2/alert/AllegatoStartRegistrazione.png) |
| Alert Smartphone aggiunto al carrello | Un messaggio di avviso temporaneo, con una durata predefinita di 3 secondi, che appare dopo aver cliccato sul pulsante "Aggiungi al carrello" dalla pagina principale e che indica l'inserimento del relativo smartphone nel carrello utente. | ![SmartphoneAggiunto](images/gui/v2/alert/SmartphoneCarrello1.png) |
| Alert elimina profilo customer |  Un avviso a comparsa, dopo aver cliccato sul bottone elimina il profilo, dalla pagina di visualizzazione del proprio profilo, richiedendo la conferma dell'azione da parte dell'utente. | ![AlertEliminazioneProprioProfilo](images/gui/v2/alert/AlertInfoProfiloCustomerEliminazione.png) |
| Alert elimina recensione |  Un avviso a comparsa, dopo aver cliccato sul bottone "Rimuovi", dalla pagina di visualizzazione delle recensioni, richiedendo la conferma dell'azione da parte dell'utente. | ![AlertRimozioneRecensione](images/gui/v2/alert/AlertInfoProfiloCustomerRecensioniEliminazione.png) |
| Alert modello disponibile aperto manager nuovo |  Un avviso a comparsa, dopo aver cliccato sul bottone "Nuovo prodotto", dalla pagina di visualizzazione di un determinato modello ancora disponibile, richiedendo la quantità di prodotti che si intendo inserire per il modello selezionato. | ![AlertNuovoProdottoDisponibile](images/gui/v2/alert/AlertModelloApertoDisponibileManagerNuovo.png) |
| Alert modello terminato manager nuovo |  Un avviso a comparsa, dopo aver cliccato sul bottone "Nuovo prodotto", dalla pagina di visualizzazione di un determinato modello terminato, richiedendo la quantità di prodotti che si intendo inserire per il modello selezionato. | ![AlertNuovoProdottoDisponibile](images/gui/v2/alert/AlertModelloApertoTerminatoManagerNuovo.png) |
| Alert modello terminato manager elimina |  Un avviso a comparsa, dopo aver cliccato sul bottone "Elimina il modello", dalla pagina di visualizzazione di un determinato modello terminato, richiedendo la conferma dell'opeeazione da parte dell'utente employee o manager. | ![AlertEliminaModelloTerminato](images/gui/v2/alert/AlertModelloApertoTerminatoManagerElimina.png) |
| Alert acquisto carrello vuoto | Un avviso che compare dopo aver cliccato sul pulsante "Procedi con il checkout" dalla pagina del carrello vuoto, segnalando, all'utente customer, l'impossibilità di avviare il processo di checkout in assenza di prodotti nel carrello. | ![CheckoutCarrelloVuoto](images/gui/v2/alert/AlertCarrelloVuoto.png) |
| Alert rimuovi prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Rimuovi" dalla pagina di visualizzazione del carrello, richiedendo la conferma dell'azione da parte dell'utente customer. | ![RimuoviProdottoCarrello](images/gui/v2/alert/AlertCarrelloPienoEliminazione.png) |
| Alert svuota carrello |  Un avviso che compare dopo aver cliccato sul pulsante "Svuota l'intero carrello" dalla pagina di visualizzazione del carrello, richiedendo la conferma dell'azione da parte dell'utente customer. | ![SvuotaCarrello](images/gui/v2/alert/AlertSvuotaCarrello.png) |
|Alert scelta checkout| Alert relativo alla selezione di una modalità di ricezione dell'ordine. | ![Scelta Checkout](images/gui/v2/alert/AlertCheckout.png) |
|Alert metodo di pagamento nullo| Alert che avvisa l'utente customer di non poter procedere all'operazione di spedizione poiché nessun metodo di pagamento risulta selezionato. | ![MetodoPagamentoNullo](images/gui/v2/alert/AlertCheckoutSpedizioneNulla.png) |
| Alert prodotto aggiunto al carrello | Un avviso a comparsa temporizzato, della durata di 3 secondi, che appare dopo aver cliccato sul pulsante "Aggiungi al carrello" dalla pagina di un prodotto specifico, indicando l'inserimento del prodotto nel carrello utente.  | ![ProdottoAggiunto](images/gui/v2/alert/ProdottoApertoDisponibileCarrello.png) |
| Alert prodotto contrassegnato come venduto | Un messaggio di avviso che appare dopo che un manager ha cliccato sul pulsante "Contrassegna come venduto" dalla pagina di un prodotto specifico, indicando l'aggiornamento della data di vendita associata al prodotto. | ![ProdottoManagerVendita](images/gui/v2/alert/AlertProdottoApertoManagerVendita.png) |
| Alert prodotto eliminato | Un avviso a comparsa che appare dopo aver cliccato sul pulsante "Elimina il prodotto" dalla pagina di un prodotto specifico, richiedendo la conferma dell'azione da parte del manager.  | ![ProdottoManagerElimina](images/gui/v2/alert/AlertProdottoApertoManagerElimina.png) |
| Alert nuovo prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci prodotto" dalla pagina di inserimento dei dati di un nuovo prodotto che conferma l'avvenuto caricamento. | ![AlertNuovoProdotto](images/gui/v2/alert/AlertNewProductDone.png) |
| Alert error nuovo prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci prodotto" dalla pagina di inserimento dei dati di un nuovo prodotto che mostra un errore nei dati. | ![AlertErrorNuovoProdotto](images/gui/v2/alert/AlertErrorNewProductDone.png) |
| Alert elimina prodotto |  Un avviso che compare, dopo aver cliccato sul bottone elimina, dalla pagina di visualizzazione dell'elenco dei prodotti, richiedendo la conferma dell'azione da parte dell'utente manager. | ![AlertEliminaProdotto](images/gui/v2/alert/AlertVisualizzaProdottiManagerTuttiElimina.png) |

\<Report here the GUI that you propose for EZElectronics in FUTURE form, as proposed by the team. You are free to organize it as you prefer. A suggested presentation matches the Use cases and scenarios defined in the Requirement document. The GUI can be shown as a sequence of graphical files (jpg, png) >
