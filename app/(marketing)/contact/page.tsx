import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact — Watchtower',
  description: 'Questions about a workspace, Enterprise, or anything else. Reach us directly.',
};

export default function Contact() {
  return (
    <section className="mkt-section">
      <div className="wrap">
        <span className="mkt-eyebrow">Contact</span>
        <h2>Talk to us.</h2>
        <p className="lede">Sales questions, an Enterprise workspace, or something broke. This reaches the people building it, not a queue.</p>
        <div className="contact-grid">
          <ContactForm />
          <div className="contact-info">
            <h4>Prefer email?</h4>
            <p className="mono">hello@watchtower.example</p>
            <h4>Enterprise &amp; SSO</h4>
            <p>Ask about unlimited competitors, CRM-embedded battlecards, and a native win-loss program.</p>
            <h4>Already a customer?</h4>
            <p>Sign in and use the in-app feedback link for the fastest response.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
