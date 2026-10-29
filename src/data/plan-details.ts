const prices = { en: ['$150', '$180', '$250'], it: ['€135', '€162', '€225'] } as const;
const slugs = ['essential', 'growth', 'ai-commerce'] as const;
const names = ['Essential', 'Growth', 'AI Commerce'] as const;

const copy = {
  en: [
    {
      summary: 'A WordPress website with a premium theme adapted to your brand, the necessary licenses, and ongoing maintenance, without hosting or monthly development hours.',
      audienceIntro: 'Essential is for businesses that need a WordPress website and ongoing technical care and have their own hosting.',
      audience: ['Businesses that need a WordPress site with a premium theme adapted to their brand.', 'Teams that already have hosting and do not need to move it to ElPuas Digital Crafts.', 'Websites that do not need development changes every month.', 'Clients who prefer to request support and follow up by email.'],
      included: [
        { title: 'WordPress website and licenses', description: 'A website built with a premium theme adapted to your brand and the licenses needed to run it.', icon: 'ph:layout' },
        { title: 'Updates and maintenance', description: 'Technical review and application of WordPress core, theme, and plugin updates.', icon: 'ph:arrows-clockwise' },
        { title: 'Regular backups', description: 'Regular website backups to provide a recovery point if a technical issue occurs.', icon: 'ph:database' },
        { title: 'Security and monitoring', description: 'Monitoring the website and reviewing signs of outages or security risks.', icon: 'ph:shield-check' },
        { title: 'Email support', description: 'A direct channel for reporting issues, asking maintenance questions, and coordinating covered work.', icon: 'ph:envelope-simple' },
      ],
      limits: ['Hosting and migration to another provider are not included.', 'The initial site uses an adapted premium theme; fully custom development and additional features are quoted separately.', 'Monthly development hours for changes after delivery are not included.', 'The scope, pages, products, and integrations are confirmed before subscribing; additional work is quoted separately.', 'Complex recovery, post-hack cleanup, and work beyond routine maintenance require a separate assessment and quote.'],
      steps: [
        { title: 'Initial review', description: 'We discuss your business, the website you need, your hosting, and brand materials to define the scope.' },
        { title: 'Website preparation', description: 'We agree on the scope, adapt a premium theme to your brand, and prepare the required licenses.' },
        { title: 'Monthly care', description: 'We perform the included maintenance, backups, and monitoring with a focus on stability.' },
        { title: 'Email support', description: 'You can report issues and questions by email. Work outside the scope is quoted before it begins.' },
      ],
      faqs: [
        { question: 'Does Essential include hosting?', answer: 'No. The website uses your hosting. Growth and AI Commerce include hosting managed by ElPuas Digital Crafts.' },
        { question: 'Can I request changes?', answer: 'The initial theme adaptation is included. Changes after delivery can be quoted separately; Essential has no monthly development hours.' },
        { question: 'Does this plan include a new website?', answer: 'Yes. It includes a WordPress website with a premium theme adapted to your brand and the necessary licenses. The specific scope is confirmed before subscribing.' },
        { question: 'Is support available through Slack?', answer: 'Email support is included. Slack is available only when expressly confirmed in the contracted service or proposal.' },
        { question: 'What does maintenance cover?', answer: 'It includes WordPress and plugin updates, backup checks, monitoring, and email support for issues such as an error after an update.' },
        { question: 'What if an existing site needs work before starting?', answer: 'We review its condition and required work before confirming the scope. Additional work is presented for approval.' },
      ],
    },
    {
      summary: 'A WordPress website with a premium theme adapted to your brand and licenses, plus hosting, maintenance, and 4 monthly development hours for small improvements.',
      audienceIntro: 'Growth is for businesses that want hosting, maintenance, and recurring improvements with one technical team.',
      audience: ['Businesses that need a branded WordPress website and regular small improvements.', 'Clients who want hosting managed by ElPuas Digital Crafts.', 'Teams that need monthly time for content, style, or configuration adjustments.', 'Websites that benefit from performance monitoring and a monthly report.'],
      included: [
        { title: 'Everything in Essential', description: 'A WordPress website with an adapted premium theme and licenses, updates, backups, security, monitoring, and email support.', icon: 'ph:shield-check' },
        { title: 'Hosting included', description: 'Hosting managed by ElPuas Digital Crafts for the agreed website, subject to the initial technical review.', icon: 'ph:cloud' },
        { title: '4 development hours per month', description: 'Time for small, clearly scoped tasks. Unused hours do not roll over.', icon: 'ph:code' },
        { title: 'Performance optimization', description: 'Reasonable performance review and adjustments within the website’s existing architecture and tools.', icon: 'ph:gauge' },
        { title: 'Monthly report', description: 'A summary of maintenance, observed status, and development hours used during the period.', icon: 'ph:chart-line-up' },
      ],
      limits: ['The 4 monthly hours do not roll over; work beyond them requires a separate quote and approval.', 'The initial site uses an adapted premium theme. Full redesigns, complex features, and custom integrations are quoted separately.', 'Hosting covers the agreed site; special infrastructure, traffic, storage, or external service needs are assessed separately.', 'The scope, pages, products, and integrations are confirmed before subscribing.', 'Editorial writing, photography, translation, and campaigns are not included.'],
      steps: [
        { title: 'Review and access', description: 'We review your business needs, brand materials, and any existing website and hosting.' },
        { title: 'Onboarding and hosting', description: 'We agree on scope, adapt the premium theme, prepare licenses and hosting, and review any required migration.' },
        { title: 'Monthly priorities', description: 'You send requests and we agree which tasks fit within the 4 hours. Additional work is estimated before execution.' },
        { title: 'Maintenance and report', description: 'We perform maintenance, monitoring, optimization, and approved tasks, then summarize the work and hours used.' },
      ],
      faqs: [
        { question: 'What can the 4 monthly hours cover?', answer: 'Small changes such as adjusting a section, fixing styles, or configuring a form. We confirm whether the request fits before starting.' },
        { question: 'Do unused hours roll over?', answer: 'No. The allowance applies to the active month and does not transfer to the next period.' },
        { question: 'What do you review for performance and reporting?', answer: 'We may review caching, resource loading, or a speed regression. The monthly report summarizes updates, backups, incidents, and completed tasks.' },
        { question: 'Does Growth include a new website?', answer: 'Yes. It includes a WordPress site with a premium theme adapted to your brand and the necessary licenses. Scope is confirmed before subscribing.' },
        { question: 'Is migration to the included hosting automatic?', answer: 'We first review the website and infrastructure. Extraordinary migration work is scoped before it is performed.' },
        { question: 'Does Growth include Slack?', answer: 'Email support is included. Slack is available only when expressly included in the contracted service or proposal.' },
      ],
    },
    {
      summary: 'Everything in Growth, with 8 monthly development hours and WordPress-integrated AI for content, translation, SEO, marketing images, and agreed automations.',
      audienceIntro: 'AI Commerce is for teams that want a WordPress website and AI in defined workflows, with clear limits and human review.',
      audience: ['Businesses that regularly publish or update content in WordPress.', 'Stores that need help preparing descriptions, translations, or product metadata.', 'Teams that want to reduce repetitive editorial tasks while retaining control.', 'Clients who need hosting, maintenance, and 8 monthly development hours.'],
      included: [
        { title: 'Everything in Growth', description: 'The adapted premium-theme website and licenses, hosting, maintenance, backups, security, monitoring, email support, optimization, and reports, with 8 development hours per month in total.', icon: 'ph:trend-up' },
        { title: 'AI integrated into WordPress', description: 'Functions enabled within the website for agreed tasks; public chatbots and custom agents are excluded.', icon: 'ph:sparkle' },
        { title: 'Assisted content and translation', description: 'Text generation, rewriting, summaries, and translation based on client-provided instructions and information.', icon: 'ph:translate' },
        { title: 'SEO assistance', description: 'Assisted SEO titles, meta descriptions, and text improvements; not a full SEO audit or strategy.', icon: 'ph:magnifying-glass' },
        { title: 'AI marketing images', description: 'Access to the image-generation function configured for the site. The text-token allowance is not an image quota.', icon: 'ph:image' },
        { title: 'Defined automations', description: 'Editorial or administrative WordPress workflows agreed during onboarding. External integrations are assessed separately.', icon: 'ph:gear-six' },
        { title: 'Up to 3 million text tokens', description: 'A monthly allowance for enabled text functions; consumption depends on each request.', icon: 'ph:text-aa' },
      ],
      limits: ['Public chatbots, customer-support assistants, and custom AI agents are excluded.', 'The 3 million tokens are for text only and do not convert into an image quota.', 'Image usage policy, provider, limits, and applicable costs must be confirmed in writing before activation.', 'Included automations are limited to workflows agreed during onboarding; external APIs and integrations are quoted separately.', 'Video, audio, speech-to-text, text-to-speech, and general AI use outside the site are excluded.', 'AI assists with drafts; unlimited human editorial, translation, design, or strategy services are not included.', 'Additional consumption and work beyond the 8 monthly development hours require a separate quote and approval.'],
      steps: [
        { title: 'Website and use-case review', description: 'We review your website needs, hosting, available data, and tasks you want AI to help with.' },
        { title: 'Define functions and limits', description: 'We agree on text, image, and automation functions, users, and human review.' },
        { title: 'Setup and onboarding', description: 'We prepare Growth hosting and maintenance, configure the agreed functions, and explain how to use them responsibly.' },
        { title: 'Monthly operation', description: 'We maintain the site, handle requests, review text consumption, and report on work. Scope changes are quoted in advance.' },
      ],
      faqs: [
        { question: 'What can I use the AI functions for?', answer: 'You can prepare and translate product drafts, propose SEO titles and meta descriptions, or generate marketing images for review.' },
        { question: 'Is a customer chatbot included?', answer: 'No. Public chatbots, customer-service assistants, and custom agents require a separate scope.' },
        { question: 'Do the 3 million tokens cover images?', answer: 'No. The allowance is exclusively for text and is not converted into image credits or a number of images.' },
        { question: 'How many images can I generate?', answer: 'The provider, applicable image limit, and any usage costs must be confirmed in writing before the function is activated.' },
        { question: 'Which automations are included?', answer: 'WordPress workflows explicitly agreed during onboarding, such as preparing metadata drafts. CRM, ERP, external APIs, and custom integrations are quoted separately.' },
        { question: 'Does AI publish automatically?', answer: 'Automatic publication is not assumed. Any workflow able to publish or act requires specific definition and approval.' },
        { question: 'Can AI Commerce build a new store?', answer: 'The plan includes a WordPress website with an adapted premium theme and licenses. The store, catalog, and integration scope must be confirmed before subscribing; additional work is quoted separately.' },
      ],
    },
  ],
  it: [
    {
      summary: 'Un sito WordPress con un tema premium adattato al tuo brand, le licenze necessarie e manutenzione continua, senza hosting né ore mensili di sviluppo.',
      audienceIntro: 'Essential è pensato per chi ha bisogno di un sito WordPress e assistenza tecnica continua e dispone già del proprio hosting.',
      audience: ['Attività che desiderano un sito WordPress con un tema premium adattato al brand.', 'Team che dispongono già di hosting e non devono trasferirlo a ElPuas Digital Crafts.', 'Siti che non richiedono modifiche di sviluppo ogni mese.', 'Clienti che preferiscono richiedere assistenza e ricevere aggiornamenti via email.'],
      included: [
        { title: 'Sito WordPress e licenze', description: 'Creazione di un sito con tema premium adattato al tuo brand e le licenze necessarie al suo funzionamento.', icon: 'ph:layout' },
        { title: 'Aggiornamenti e manutenzione', description: 'Revisione tecnica e aggiornamento del core WordPress, dei temi e dei plugin.', icon: 'ph:arrows-clockwise' },
        { title: 'Backup regolari', description: 'Backup regolari del sito per disporre di un punto di ripristino in caso di problemi tecnici.', icon: 'ph:database' },
        { title: 'Sicurezza e monitoraggio', description: 'Monitoraggio del sito e verifica di eventuali interruzioni o rischi di sicurezza.', icon: 'ph:shield-check' },
        { title: 'Supporto via email', description: 'Un canale diretto per segnalare problemi, chiedere informazioni e coordinare gli interventi inclusi.', icon: 'ph:envelope-simple' },
      ],
      limits: ['Hosting e migrazione verso un altro fornitore non sono inclusi.', 'Il sito iniziale utilizza un tema premium adattato; sviluppo completamente personalizzato e funzionalità aggiuntive sono preventivati separatamente.', 'Non sono incluse ore mensili di sviluppo per modifiche dopo la consegna.', 'Ambito, pagine, prodotti e integrazioni vengono concordati prima della sottoscrizione; il lavoro aggiuntivo è preventivato separatamente.', 'Ripristini complessi, pulizia dopo un attacco e lavori oltre la manutenzione ordinaria richiedono una valutazione e un preventivo.'],
      steps: [
        { title: 'Valutazione iniziale', description: 'Parliamo della tua attività, del sito necessario, dell’hosting e dei materiali del brand per definire l’ambito.' },
        { title: 'Preparazione del sito', description: 'Concordiamo l’ambito, adattiamo un tema premium al tuo brand e prepariamo le licenze necessarie.' },
        { title: 'Manutenzione mensile', description: 'Eseguiamo la manutenzione, i backup e il monitoraggio inclusi, dando priorità alla stabilità.' },
        { title: 'Assistenza via email', description: 'Puoi segnalare problemi e domande via email. Il lavoro fuori ambito viene preventivato prima di iniziare.' },
      ],
      faqs: [
        { question: 'Essential include l’hosting?', answer: 'No. Il sito utilizza il tuo hosting. Growth e AI Commerce includono hosting gestito da ElPuas Digital Crafts.' },
        { question: 'Posso richiedere modifiche?', answer: 'L’adattamento iniziale è incluso. Le modifiche successive possono essere preventivate separatamente: Essential non include ore mensili di sviluppo.' },
        { question: 'Il piano include un nuovo sito?', answer: 'Sì. Include un sito WordPress con un tema premium adattato al tuo brand e le licenze necessarie. L’ambito viene confermato prima della sottoscrizione.' },
        { question: 'Il supporto è disponibile su Slack?', answer: 'Il supporto via email è incluso. Slack è disponibile solo se espressamente previsto dal servizio o dalla proposta.' },
        { question: 'Cosa comprende la manutenzione?', answer: 'Comprende aggiornamenti WordPress e plugin, verifica dei backup, monitoraggio e assistenza via email per problemi come un errore dopo un aggiornamento.' },
        { question: 'E se un sito esistente richiede interventi iniziali?', answer: 'Valutiamo le condizioni e il lavoro necessario prima di confermare l’ambito. Gli interventi aggiuntivi vengono presentati per approvazione.' },
      ],
    },
    {
      summary: 'Un sito WordPress con tema premium adattato al tuo brand e licenze, più hosting, manutenzione e 4 ore mensili di sviluppo per piccoli miglioramenti.',
      audienceIntro: 'Growth è pensato per chi desidera hosting, manutenzione e miglioramenti ricorrenti con lo stesso team tecnico.',
      audience: ['Attività che necessitano di un sito WordPress coerente con il brand e piccoli miglioramenti regolari.', 'Clienti che desiderano hosting gestito da ElPuas Digital Crafts.', 'Team che necessitano di tempo mensile per contenuti, stile o configurazioni.', 'Siti che beneficiano del monitoraggio delle prestazioni e di un report mensile.'],
      included: [
        { title: 'Tutto ciò che include Essential', description: 'Sito WordPress con tema premium adattato e licenze, aggiornamenti, backup, sicurezza, monitoraggio e supporto via email.', icon: 'ph:shield-check' },
        { title: 'Hosting incluso', description: 'Hosting gestito da ElPuas Digital Crafts per il sito concordato, soggetto alla verifica tecnica iniziale.', icon: 'ph:cloud' },
        { title: '4 ore di sviluppo al mese', description: 'Tempo per attività piccole e ben definite. Le ore non utilizzate non si accumulano.', icon: 'ph:code' },
        { title: 'Ottimizzazione delle prestazioni', description: 'Revisione e interventi ragionevoli sulle prestazioni entro l’architettura e gli strumenti del sito.', icon: 'ph:gauge' },
        { title: 'Report mensile', description: 'Un riepilogo della manutenzione, dello stato osservato e delle ore di sviluppo utilizzate nel periodo.', icon: 'ph:chart-line-up' },
      ],
      limits: ['Le 4 ore mensili non si accumulano; il lavoro eccedente richiede preventivo e approvazione separati.', 'Il sito iniziale usa un tema premium adattato. Redesign completi, funzionalità complesse e integrazioni personalizzate sono preventivati separatamente.', 'L’hosting copre il sito concordato; esigenze speciali di infrastruttura, traffico, spazio o servizi esterni sono valutate a parte.', 'Ambito, pagine, prodotti e integrazioni sono concordati prima della sottoscrizione.', 'Redazione, fotografia, traduzioni e campagne editoriali non sono incluse.'],
      steps: [
        { title: 'Valutazione e accessi', description: 'Esaminiamo le esigenze della tua attività, i materiali del brand e gli eventuali sito e hosting esistenti.' },
        { title: 'Avvio e hosting', description: 'Concordiamo l’ambito, adattiamo il tema premium, prepariamo licenze e hosting e valutiamo l’eventuale migrazione.' },
        { title: 'Priorità mensili', description: 'Invii le richieste e concordiamo le attività che rientrano nelle 4 ore. Il lavoro aggiuntivo viene stimato prima di iniziare.' },
        { title: 'Manutenzione e report', description: 'Eseguiamo manutenzione, monitoraggio, ottimizzazione e attività approvate, riepilogando lavoro e ore utilizzate.' },
      ],
      faqs: [
        { question: 'Cosa posso richiedere nelle 4 ore mensili?', answer: 'Piccole modifiche, come aggiornare una sezione, correggere gli stili o configurare un modulo. Prima di iniziare confermiamo se la richiesta rientra nelle ore disponibili.' },
        { question: 'Le ore non utilizzate si accumulano?', answer: 'No. La dotazione riguarda il mese attivo e non viene trasferita al periodo successivo.' },
        { question: 'Cosa comprende il controllo delle prestazioni e il report?', answer: 'Possiamo verificare cache, caricamento delle risorse o rallentamenti. Il report mensile riepiloga aggiornamenti, backup, problemi e attività completate.' },
        { question: 'Growth include un nuovo sito?', answer: 'Sì. Include un sito WordPress con tema premium adattato al brand e le licenze necessarie. L’ambito è confermato prima della sottoscrizione.' },
        { question: 'La migrazione all’hosting è automatica?', answer: 'Prima valutiamo il sito e l’infrastruttura. Gli eventuali lavori straordinari di migrazione vengono definiti prima di essere eseguiti.' },
        { question: 'Growth include Slack?', answer: 'Il supporto via email è incluso. Slack è disponibile solo se espressamente previsto dal servizio o dalla proposta.' },
      ],
    },
    {
      summary: 'Tutto Growth, con 8 ore mensili di sviluppo e funzioni di IA integrate in WordPress per contenuti, traduzioni, SEO, immagini di marketing e automazioni concordate.',
      audienceIntro: 'AI Commerce è pensato per team che desiderano un sito WordPress e funzioni di IA in flussi definiti, con limiti chiari e revisione umana.',
      audience: ['Attività che pubblicano o aggiornano spesso contenuti in WordPress.', 'Negozi che desiderano supporto per descrizioni, traduzioni o metadati dei prodotti.', 'Team che vogliono ridurre le attività editoriali ripetitive mantenendo il controllo.', 'Clienti che necessitano di hosting, manutenzione e 8 ore mensili di sviluppo.'],
      included: [
        { title: 'Tutto ciò che include Growth', description: 'Sito con tema premium adattato e licenze, hosting, manutenzione, backup, sicurezza, monitoraggio, supporto email, ottimizzazione e report, con 8 ore mensili di sviluppo in totale.', icon: 'ph:trend-up' },
        { title: 'IA integrata in WordPress', description: 'Funzioni abilitate nel sito per attività concordate; chatbot pubblici e agenti personalizzati sono esclusi.', icon: 'ph:sparkle' },
        { title: 'Contenuti e traduzioni assistiti', description: 'Generazione, riscrittura, sintesi e traduzione di testi sulla base di istruzioni e informazioni del cliente.', icon: 'ph:translate' },
        { title: 'Supporto SEO', description: 'Titoli SEO, meta description e miglioramenti del testo assistiti; non sostituisce un audit o una strategia SEO completa.', icon: 'ph:magnifying-glass' },
        { title: 'Immagini marketing con IA', description: 'Accesso alla funzione di generazione immagini configurata per il sito. I token di testo non costituiscono una quota di immagini.', icon: 'ph:image' },
        { title: 'Automazioni definite', description: 'Flussi editoriali o amministrativi in WordPress concordati all’avvio. Le integrazioni esterne sono valutate a parte.', icon: 'ph:gear-six' },
        { title: 'Fino a 3 milioni di token di testo', description: 'Dotazione mensile per le funzioni di testo abilitate; il consumo varia in base alla richiesta.', icon: 'ph:text-aa' },
      ],
      limits: ['Chatbot pubblici, assistenti per il servizio clienti e agenti IA personalizzati sono esclusi.', 'I 3 milioni di token sono solo per testo e non si convertono in una quota di immagini.', 'Fornitore, politica d’uso, limiti e costi delle immagini devono essere confermati per iscritto prima dell’attivazione.', 'Le automazioni incluse sono limitate ai flussi concordati all’avvio; API e integrazioni esterne sono preventivate separatamente.', 'Sono esclusi video, audio, voce-testo, testo-voce e uso generale dell’IA fuori dal sito.', 'L’IA aiuta a preparare bozze; servizi umani illimitati di redazione, traduzione, design o strategia non sono inclusi.', 'Consumi aggiuntivi e lavori oltre le 8 ore mensili richiedono preventivo e approvazione separati.'],
      steps: [
        { title: 'Valutazione del sito e dei casi d’uso', description: 'Esaminiamo il sito necessario, l’hosting, i dati disponibili e le attività da migliorare con l’IA.' },
        { title: 'Definizione di funzioni e limiti', description: 'Concordiamo funzioni di testo, immagini e automazioni, utenti e revisione umana.' },
        { title: 'Configurazione e avvio', description: 'Prepariamo hosting e manutenzione di Growth, configuriamo le funzioni concordate e spieghiamo come usarle responsabilmente.' },
        { title: 'Gestione mensile', description: 'Manteniamo il sito, gestiamo le richieste, controlliamo il consumo di testo e rendicontiamo il lavoro. Le modifiche all’ambito vengono preventivate prima.' },
      ],
      faqs: [
        { question: 'Per cosa posso usare le funzioni di IA?', answer: 'Puoi preparare e tradurre bozze di descrizioni, proporre titoli SEO e meta description o generare immagini marketing da revisionare.' },
        { question: 'È incluso un chatbot per i clienti?', answer: 'No. Chatbot pubblici, assistenti per il servizio clienti e agenti personalizzati richiedono un ambito separato.' },
        { question: 'I 3 milioni di token coprono anche le immagini?', answer: 'No. La dotazione riguarda esclusivamente il testo e non viene convertita in crediti o quantità di immagini.' },
        { question: 'Quante immagini posso generare?', answer: 'Il fornitore, il limite applicabile e gli eventuali costi devono essere confermati per iscritto prima di attivare la funzione.' },
        { question: 'Quali automazioni sono incluse?', answer: 'I flussi WordPress concordati all’avvio, ad esempio la preparazione di bozze di metadati. CRM, ERP, API esterne e integrazioni personalizzate sono preventivati a parte.' },
        { question: 'L’IA pubblica automaticamente?', answer: 'La pubblicazione automatica non è presunta. Qualsiasi flusso capace di pubblicare o agire richiede una definizione e un’approvazione specifiche.' },
        { question: 'AI Commerce permette di creare un nuovo negozio?', answer: 'Il piano include un sito WordPress con tema premium adattato e licenze. L’ambito del negozio, del catalogo e delle integrazioni deve essere confermato prima della sottoscrizione; il lavoro aggiuntivo è preventivato a parte.' },
      ],
    },
  ],
} as const;

export function getPlanDetails(lang: 'en' | 'it', index: number) {
  const plan = copy[lang][index];
  return {
    ...plan,
    name: names[index],
    price: prices[lang][index],
    contactValue: names[index],
    relatedPlans: names.map((name, i) => ({ name, price: prices[lang][i], href: `/${lang}/services/${slugs[i]}`, description: lang === 'en' ? ['Premium-theme website, licenses and maintenance.', 'Hosting, 4 monthly development hours, optimization and reports.', 'Growth with 8 monthly development hours and WordPress AI.'][i] : ['Sito con tema premium, licenze e manutenzione.', 'Hosting, 4 ore mensili di sviluppo, ottimizzazione e report.', 'Growth con 8 ore mensili di sviluppo e IA in WordPress.'][i] })).filter((_, i) => i !== index),
  };
}

export { slugs };
