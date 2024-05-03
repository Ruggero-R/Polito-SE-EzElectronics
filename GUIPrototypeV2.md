# Graphical User Interface Prototype - FUTURE

Authors: Carlino Mattia, Coppola Neri Valerio, Mosca Alessandro, Rossino Ruggero

Date:

Version: 2.0.0

# Application GUI

| Functionality | Description | Image |
| ----------------- | ----------------- |:-----------:|
|Login| La pagina dedicata all'autenticazione degli utenti. | ![Login](images/gui/v2/StartLogin.png) |
|Register| Pagina relativa alla registrazione di un utente. | ![Registrazione](images/gui/v2/StartRegistrazione.png) |
|Home principale v1| La homepage nella sua versione base, senza alcun filtro per la visualizzazione dei prodotti in vendita. | ![HomePageAll](images/gui/homepage/HomeTutti.png) |
|Home principale v2| La homepage con il filtro applicato ("Venduti") per visualizzare solo i prodotti già venduti. | ![HomePageSoldYes](images/gui/homepage/HomeVenduti.png) |
|Home principale v3| La homepage con il filtro applicato ("Non Venduti") per visualizzare solo i prodotti non ancora venduti.| ![HomePageSoldNo](images/gui/homepage/HomeNonVenduti.png) |
|Smartphone| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Smartphone". | ![Smartphone](images/gui/homepage/Smartphone.png) |
|Laptop| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Laptop". | ![Laptop](images/gui/homepage/Laptop.png) |
|Elettrodomestici| Pagina relativa alla presentazione generale dei prodotti appartenenti alla categoria "Elettrodomestici". | ![Elettrodomestici](images/gui/homepage/Elettrodomestici.png) |
|Visualizzazione prodotto disponibile| Pagina relativa alla visualizzazione, da parte di un utente customer, di un singolo prodotto disponibile e quindi idoneo all'acquisto all'interno del sito. | ![ProdottoDisponibileCustomer](images/gui/product/ProdottoApertoDisponibile.png) |
|Visualizzazione prodotto venduto| Pagina relativa alla visualizzazione, da parte di un utente customer, di un singolo prodotto venduto e quindi non idoneo all'acquisto all'interno del sito. | ![ProdottoVendutoCustomer](images/gui/product/ProdottoApertoVenduto.png) |
|Visualizzazione prodotto disponibile| Pagina relativa alla visualizzazione, da parte di un utente manager, di un singolo prodotto disponibile e quindi idoneo all'acquisto all'interno del sito. | ![ProdottoDisponibileManager](images/gui/product/ProdottoApertoManagerDisponibile.png) |
|Visualizzazione prodotto venduto| Pagina relativa alla visualizzazione, da parte di un utente manager, di un singolo prodotto venduto e quindi non idoneo all'acquisto all'interno del sito. | ![ProdottoVendutoManager](images/gui/product/ProdottoApertoManagerVenduto.png) |
|Carrello vuoto| Pagina relativa alla visualizzazione del carrello attuale, da parte di un utente customer, nella condizione in cui nessun prodotto è stato inserito nel carrello. | ![CarrelloVuoto](images/gui/cart/CarrelloVuoto.png) |
|Carrello pieno| Pagina relativa alla visualizzazione del carrello attuale, da parte di un utente customer, nella condizione in cui sono già stati aggiunti diversi prodotti nel carrello. | ![CarrelloPieno](images/gui/cart/CarrelloPieno.png) |
|Checkout effettuato| Pagina relativa alla visualizzazione di conferma di avvenuta vendita/acquisto, da parte di un utente customer, del carrello. | ![CarrelloPieno](images/gui/cart/CheckoutEffettuato.png) |
|Cronologia carrelli vuota| Pagina relativa alla visualizzazione dello storico dei carrelli passati, da parte di un utente customer, nella condizione in cui non vi sia alcun carrello passato. | ![CronologiaCarrelliVuota](images/gui/cart/CronologiaCarrelliVuota.png) |
|Carrello carrelli piena| Pagina relativa alla visualizzazione dello storico dei carrelli passati, da parte di un utente customer, nella condizione in cui vi siano uno o più carrelli passati. | ![CronologiaCarrelliPiena](images/gui/cart/CronologiaCarrelli.png) |
|Carrello vecchio pieno| Pagina relativa alla visualizzazione del resoconto di un carrello, da parte di un utente customer, nella condizione in cui il checkout sia già stato effetuato. | ![CarrelloVecchioPieno](images/gui/cart/CarrelloVecchioPieno.png) |
|Info profilo Customer| Pagina relativa alla visualizzazione del profilo di un utente customer. | ![InfoProfiloCustomer](images/gui/profile/InfoProfiloCustomer.png) |
|Info profilo Manager| Pagina relativa alla visualizzazione del profilo di un utente manager. | ![InfoProfiloManager](images/gui/profile/InfoProfiloManager.png) |
|New product| Pagina, visualizzabile solo dall'utente manager, relativa all'inserimento di un nuovo prodotto. | ![NewProduct](images/gui/profile/NewProduct.png) |
|New stock| Pagina, visualizzabile solo dall'utente manager, relativa all'inserimento di un nuovo stock di prodotti. | ![NewStock](images/gui/profile/NewStock.png) |
|Visualizza tutti i prodotti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti presenti nel database. | ![VisualizzaProdottiTutti](images/gui/profile/VisualizzaProdottiManagerTutti.png) |
|Visualizza tutti i prodotti venduti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti non disponibili presenti nel database. | ![VisualizzaProdottiVenduti](images/gui/profile/VisualizzaProdottiManagerVenduti.png) |
|Visualizza tutti i prodotti non venduti| Pagina, visualizzabile solo dall'utente manager, relativa all'elenco di tutti i prodotti disponibili presenti nel database. | ![VisualizzaProdottiNonVenduti](images/gui/profile/VisualizzaProdottiManagerNonVenduti.png) |
|Footer| Barra di navigazione presente alla fine di ogni pagina diversa da quelle di autenticazione. Consente una user experience più piacevole. | ![Footer](images/gui/v2/footer.png) |

# Application GUI - Alert

**In questa tabella saranno riportati tutti gli alert collegati alla corretta funzionalità della GUI**

| Functionality | Description | Image |
| ----------------- | ----------------- |:-----------:|
| Alert credenziali errate | Un avviso a comparsa indicante l'inserimento errato nei campi di input durante il processo di login. | ![CredenzialiErrate](images/gui/v2/alert/AlertStartLoginErrore.png) |
| Alert campi non compilati | Un avviso a comparsa indicante la mancanza di input nei campi obbligatori durante il processo di registrazione. | ![CampiVuoti](images/gui/v2/alert/AlertStartRegistrazioneErrore.png) |
| Allegato file multimediale | Window che permette la selezione di un file multimediale da utilizzare come immagine del profilo dell'utente durante il processo di registrazione. | ![AllegatoFotoProfilo](images/gui/v2/alert/AllegatoStartRegistrazione.png) |
| Alert Smartphone aggiunto al carrello | Un messaggio di avviso temporaneo, con una durata predefinita di 3 secondi, che appare dopo aver cliccato sul pulsante "Aggiungi al carrello" dalla pagina principale e che indica l'inserimento del relativo smartphone nel carrello utente. | ![SmartphoneAggiunto](images/gui/alert/SmartphoneCarrello1.png) |
| Alert prodotto aggiunto al carrello | Un avviso a comparsa temporizzato, della durata di 3 secondi, che appare dopo aver cliccato sul pulsante "Aggiungi al carrello" dalla pagina di un prodotto specifico, indicando l'inserimento del prodotto nel carrello utente.  | ![ProdottoAggiunto](images/gui/alert/ProdottoApertoDisponibileCarrello.png) |
| Alert prodotto contrassegnato come venduto | Un messaggio di avviso che appare dopo che un manager ha cliccato sul pulsante "Contrassegna come venduto" dalla pagina di un prodotto specifico, indicando l'aggiornamento della data di vendita associata al prodotto. | ![ProdottoManagerVendita](images/gui/alert/AlertProdottoApertoManagerVendita.png) |
| Alert prodotto eliminato | Un avviso a comparsa che appare dopo aver cliccato sul pulsante "Elimina il prodotto" dalla pagina di un prodotto specifico, richiedendo la conferma dell'azione da parte del manager.  | ![ProdottoManagerElimina](images/gui/alert/AlertProdottoApertoManagerElimina.png) |
| Alert checkout vuoto | Un avviso che compare dopo aver cliccato sul pulsante "Procedi con il checkout" dalla pagina del carrello vuoto, segnalando l'impossibilità di avviare il processo di checkout in assenza di prodotti nel carrello. | ![CheckoutCarrelloVuoto](images/gui/alert/AlertCarrelloVuoto.png) |
| Alert rimuovi prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Rimuovi" dalla pagina di visualizzazione del carrello, richiedendo la conferma dell'azione da parte dell'utente customer. | ![RimuoviProdottoCarrello](images/gui/alert/AlertCarrelloPienoEliminazione.png) |
| Alert svuota carrello |  Un avviso che compare dopo aver cliccato sul pulsante "Svuota l'intero carrello" dalla pagina di visualizzazione del carrello, richiedendo la conferma dell'azione da parte dell'utente customer. | ![SvuotaCarrello](images/gui/alert/AlertSvuotaCarrello.png) |
| Alert nuovo prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci prodotto" dalla pagina di inserimento dei dati di un nuovo prodotto che conferma l'avvenuto caricamento. | ![AlertNuovoProdotto](images/gui/alert/AlertNewProductDone.png) |
| Alert error nuovo prodotto |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci prodotto" dalla pagina di inserimento dei dati di un nuovo prodotto che mostra un errore nei dati. | ![AlertErrorNuovoProdotto](images/gui/alert/AlertErrorNewProductDone.png) |
| Alert nuovo stock |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci stock prodotti" dalla pagina di inserimento dei dati di un nuovo prodotto che conferma l'avvenuto caricamento. | ![AlertNuovoStock](images/gui/alert/AlertNewStockDone.png) |
| Alert error nuovo stock |  Un avviso che compare dopo aver cliccato sul pulsante "Inserisci stock prodotti" dalla pagina di inserimento dei dati dello stock del nuovo prodotto che mostra un errore nei dati. | ![AlertErrorNuovoStock](images/gui/alert/AlertErrorNewStockDone.png) |
| Alert elimina prodotto |  Un avviso che compare, dopo aver cliccato sul bottone elimina, dalla pagina di visualizzazione dell'elenco dei prodotti, richiedendo la conferma dell'azione da parte dell'utente manager. | ![AlertEliminaProdotto](images/gui/alert/AlertVisualizzaProdottiManagerTuttiElimina.png) |

\<Report here the GUI that you propose for EZElectronics in FUTURE form, as proposed by the team. You are free to organize it as you prefer. A suggested presentation matches the Use cases and scenarios defined in the Requirement document. The GUI can be shown as a sequence of graphical files (jpg, png) >
