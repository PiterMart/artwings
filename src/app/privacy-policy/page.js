import Link from "next/link";
import styles from "./privacy-policy.module.css";

export const metadata = {
  title: "Datenschutzerklärung | ARTWINGS",
  description: "Erfahren Sie, wie ARTWINGS Ihre personenbezogenen Daten erfasst, nutzt und schützt.",
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Datenschutzerklärung</h1>
        {/* HINWEIS: Bitte prüfen Sie das Datum vor Veröffentlichung */}
        <p className={styles.lastUpdated}>Zuletzt aktualisiert: November 12, 2025</p> 
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Verantwortliche Stelle und Geltungsbereich</h2>
        <p className={styles.paragraph}>
          Die nachfolgende Datenschutzerklärung klärt Sie über die Art, den Umfang und den Zweck der Verarbeitung von personenbezogenen Daten (nachfolgend „Daten“) innerhalb unseres Online-Angebotes und der damit verbundenen Webseiten, Funktionen und Inhalte auf.
        </p>
        <p className={styles.paragraph}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>Verantwortlicher im Sinne der DSGVO:</strong>
          Artwings (Vertreten durch Goicoechea) <br />
          Swinemünder Straße 125, 10435 Berlin, Deutschland <br />
          E-Mail: Goicoechea@artwings.art
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. SSL- bzw. TLS-Verschlüsselung</h2>
        <p className={styles.paragraph}>
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die Sie an uns senden, eine SSL-bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Hosting und Server-Logfiles</h2>
        <p className={styles.paragraph}>
          Um unser Online-Angebot sicher und effizient zur Verfügung stellen zu können, nehmen wir die Leistungen von Hosting-Anbietern in Anspruch, auf deren Servern die Website gespeichert ist. Bei jedem Aufruf der Website erfasst der Hoster in sogenannten Server-Logfiles Informationen, die Ihr Browser automatisch übermittelt.
        </p>
        <p className={styles.paragraph}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>Diese Daten umfassen:</strong>
          IP-Adresse des zugreifenden Rechners, Name der abgerufenen Webseite, Datum und Uhrzeit des Abrufs, übertragene Datenmenge, Meldung über erfolgreichen Abruf, Browsertyp und -version, das Betriebssystem des Nutzers und die zuvor besuchte Seite (Referrer URL).
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO an der fehlerfreien Darstellung und Sicherheit unserer Website.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Erfassung und Nutzung von Kontaktdaten</h2>
        <p className={styles.paragraph}>
          Wenn Sie uns per E-Mail oder über andere Kommunikationswege kontaktieren, werden die von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, Name, ggf. Telefonnummer und der Inhalt Ihrer Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert.
        </p>
        <p className={styles.paragraph}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>Zweck:</strong> Beantwortung Ihrer Anfragen und Kommunikation.
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Die Verarbeitung ist zur Erfüllung eines Vertrags oder zur Durchführung vorvertraglicher Maßnahmen erforderlich (Art. 6 Abs. 1 lit. b DSGVO) oder basiert auf unserem berechtigten Interesse an der Durchführung der Kommunikation (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Einsatz von Cookies und Tracking-Technologien</h2>
        <p className={styles.paragraph}>
          Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Wir verwenden technisch notwendige Cookies zur Gewährleistung der Funktionalität der Website. Alle weiteren Cookies (z. B. für Analyse- oder Marketingzwecke) werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.
        </p>
        <p className={styles.paragraph}>
          Detaillierte Informationen zu den verwendeten Cookies, deren Zweck, Speicherdauer und Widerrufsmöglichkeiten finden Sie in unserer separaten <Link href="/cookie-policy">Cookie-Richtlinie</Link>.
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Die Speicherung von Informationen in der Endeinrichtung oder der Zugriff auf bereits in der Endeinrichtung gespeicherte Informationen erfolgt auf Grundlage des TTDSG und bei der Verarbeitung personenbezogener Daten auf Grundlage der Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Externe Dienste und Datenübermittlung in Drittländer</h2>
        <p className={styles.paragraph}>
          Wir setzen externe Dienstleister (Auftragsverarbeiter) ein, die uns bei der Bereitstellung unserer Dienste unterstützen. Hierbei kann es zur Übermittlung Ihrer Daten in Länder außerhalb der Europäischen Union (Drittländer), insbesondere in die USA, kommen. Wir stellen sicher, dass dabei die Vorgaben der Art. 44 ff. DSGVO eingehalten werden. Als Garantie dienen in der Regel die Standardvertragsklauseln (SCCs) der EU-Kommission.
        </p>

        <h3 className={styles.subSectionTitle}>6.1 Hosting: Vercel</h3>
        <p className={styles.paragraph}>
          Die Website wird bei Vercel, Inc. (USA) gehostet. Vercel verarbeitet die Logfiles und andere technische Daten, die zur Auslieferung und Sicherheit der Website erforderlich sind (siehe Abschnitt 3).
          <strong style={{ display: 'block', marginTop: '5px' }}>Zweck:</strong> Bereitstellung der Website-Inhalte und Sicherstellung der Funktionsfähigkeit.
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an einem effizienten und sicheren Betrieb des Online-Angebotes).
        </p>

        <h3 className={styles.subSectionTitle}>6.2 Datenbank und Speicherung: Google Firebase</h3>
        <p className={styles.paragraph}>
          Wir nutzen Google Firebase (Firestore und Storage), bereitgestellt von Google Ireland Limited (EU) bzw. Google LLC (USA), zur Speicherung von Anwendungsdaten (z. B. Informationen über Ausstellungen, Künstler und ggf. Nutzerdaten).
          <strong style={{ display: 'block', marginTop: '5px' }}>Zweck:</strong> Sicherstellung der Applikationsfunktionalität und Speicherung von Inhalten.
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung zur Erbringung des Dienstes).
        </p>
        
        <h3 className={styles.subSectionTitle}>6.3 Google Fonts</h3>
        <p className={styles.paragraph}>
          Zur Darstellung von Inhalten nutzen wir möglicherweise externe Schriften von Google Ireland Limited (Google Fonts). Die Einbindung dieser Web Fonts erfolgt durch einen Serveraufruf bei Google (meist in den USA). Hierdurch wird an den Server übermittelt, welche unserer Internetseiten Sie besucht haben. Auch wird die IP-Adresse des Browsers des Endgerätes des Besuchers dieser Internetseiten von Google gespeichert.
          <strong style={{ display: 'block', marginTop: '5px' }}>Zweck:</strong> Gewährleistung einer einheitlichen und ansprechenden Darstellung unserer Online-Angebote.
          <strong style={{ display: 'block', marginTop: '5px' }}>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, die über den Cookie-Banner eingeholt wird) oder, falls lokal gehostet, Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse).
        </p>

        <h3 className={styles.subSectionTitle}>6.4 Externe Links (Instagram)</h3>
        <p className={styles.paragraph}>
          Auf unserer Seite finden Sie einen Link zu unserem Instagram-Profil. Durch das Anklicken dieses Links verlassen Sie unsere Website und gelangen auf das Angebot von Meta Platforms Ireland Limited. Erst in diesem Moment beginnt Meta mit der Datenerfassung. Auf die Datenerfassung durch Meta haben wir keinen Einfluss.
          <strong style={{ display: 'block', marginTop: '5px' }}>Bitte beachten Sie:</strong> Zweck und Umfang der Datenerhebung durch Meta sowie die dortige weitere Verarbeitung und Nutzung Ihrer Daten sowie Ihre diesbezüglichen Rechte und Einstellungsmöglichkeiten zum Schutz Ihrer Privatsphäre entnehmen Sie bitte den Datenschutzhinweisen von Meta.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Betroffenenrechte (Ihre Rechte nach der DSGVO)</h2>
        <p className={styles.paragraph}>
          Sie haben jederzeit das Recht, Auskunft über Ihre verarbeiteten Daten zu erhalten. Ferner haben Sie das Recht auf Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch gegen die Verarbeitung sowie das Recht auf Datenübertragbarkeit und Widerruf Ihrer Einwilligung.
        </p>
        <ul className={styles.list}>
          <li><strong style={{ fontWeight: 'bold' }}>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können eine Bestätigung verlangen, ob Daten verarbeitet werden und Auskunft über diese Daten erhalten.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können die Vervollständigung oder Berichtigung der Sie betreffenden Daten verlangen.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die unverzügliche Löschung Ihrer Daten verlangen.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen, wenn eine der gesetzlichen Voraussetzungen vorliegt.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, jederzeit gegen die Verarbeitung Ihrer Daten Widerspruch einzulegen.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, die Sie betreffenden Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Widerrufsrecht:</strong> Sie haben das Recht, erteilte Einwilligungen (z.B. in Cookies) jederzeit zu widerrufen.</li>
          <li><strong style={{ fontWeight: 'bold' }}>Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, insbesondere bei der für uns zuständigen Berliner Beauftragten für Datenschutz und Informationsfreiheit.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Datenlöschung und Speicherdauer</h2>
        <p className={styles.paragraph}>
          Die von uns verarbeiteten Daten werden gelöscht oder in ihrer Verarbeitung eingeschränkt, sobald sie für ihre Zweckbestimmung nicht mehr erforderlich sind und der Löschung keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung eingeschränkt. Das bedeutet, die Daten werden gesperrt und nicht für andere Zwecke verarbeitet.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Änderungen dieser Datenschutzerklärung</h2>
        <p className={styles.paragraph}>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
        </p>
      </section>

      <div className={styles.backLinkWrapper}>
        <Link href="/" className={styles.backLink}>
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}