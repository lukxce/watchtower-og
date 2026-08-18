import '../company.css';
import EmailPrefsForm from './EmailPrefsForm';

export const metadata = {
  title: 'Email Preferences — Fortress HQ',
  description: 'Tell us what you would like less of, and we will update it by hand.',
};

export default function EmailPreferences() {
  return (
    <section className="cox-page">
      <div className="wrap cox-legal">
        <h1>Email preferences</h1>
        <p className="cox-updated">Update what you hear from us.</p>

        <p>
          We&rsquo;re a small team and don&rsquo;t have a self-serve preference center built yet, so this form
          doesn&rsquo;t update anything automatically. Enter your email and what you&rsquo;d like less of, and
          submitting will open an email to us with those details filled in — we read every one of these and
          update your preferences by hand, usually within a day or two.
        </p>

        <EmailPrefsForm />
      </div>
    </section>
  );
}
