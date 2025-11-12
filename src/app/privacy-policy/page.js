import Link from "next/link";
import styles from "./privacy-policy.module.css";

export const metadata = {
  title: "Privacy Policy | ARTWINGS",
  description: "Learn how ARTWINGS collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: November 12, 2025</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Introduction</h2>
        <p className={styles.paragraph}>
          ARTWINGS is committed to protecting your privacy. This Privacy Policy outlines how we
          collect, use, and safeguard your personal information when you interact with our website,
          events, and services. By accessing or using our site, you agree to the practices described
          in this policy.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
        <p className={styles.paragraph}>
          We may collect personal information that you voluntarily provide, such as your name, email
          address, social media handle, or any other details you share when you contact us, subscribe
          to our updates, or participate in our events. We also gather limited technical information,
          including browser type, device information, and interactions with our content to improve the
          user experience.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
        <p className={styles.paragraph}>
          We use collected information to respond to inquiries, share updates about ARTWINGS
          exhibitions, improve our website, and ensure a secure and engaging experience for visitors
          and collaborators. We do not sell or rent your personal data. If we collaborate with trusted
          partners, we ensure that they adhere to strict confidentiality obligations.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Data Retention</h2>
        <p className={styles.paragraph}>
          We retain your personal information only for as long as necessary to fulfill the purposes
          described in this policy, comply with legal obligations, resolve disputes, and enforce our
          agreements. When information is no longer needed, we will securely delete or anonymize it.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Your Rights</h2>
        <p className={styles.paragraph}>
          Depending on your location, you may have the right to access, correct, or delete your
          personal information, as well as to object to or restrict certain processing activities. To
          exercise these rights, please contact us using the details below. We will respond to your
          request in accordance with applicable laws.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Contact Us</h2>
        <p className={styles.paragraph}>
          If you have questions about this Privacy Policy or how your information is handled, reach
          out to us at{" "}
          <a className={styles.link} href="mailto:info@artwings.art">
            info@artwings.art
          </a>{" "}
          or connect with us on{" "}
          <a
            className={styles.link}
            href="https://www.instagram.com/artwings111/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          .
        </p>
      </section>

      <div className={styles.backLinkWrapper}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

