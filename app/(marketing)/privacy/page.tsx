/*
  DRAFT — this is a starting point, not finished legal work. It has not been
  reviewed by a lawyer. Fortress HQ should get real legal review on this
  policy before it is relied on at launch. Nothing on this page is legal
  advice.
*/
import '../company.css';

export const metadata = {
  title: 'Privacy Policy — Fortress HQ',
  description: 'How Fortress HQ collects, uses, and protects information — in plain language.',
};

export default function Privacy() {
  return (
    <section className="cox-page">
      <div className="wrap cox-legal">
        <p className="cox-note">
          Draft policy — this page has not yet had a legal review, and nothing on it is legal advice. Treat it
          as a plain-language starting point until it has been checked by a lawyer.
        </p>

        <h1>Privacy Policy</h1>
        <p className="cox-updated">Last updated 18 August 2026</p>

        <p>
          Fortress HQ (&ldquo;Fortress HQ,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) builds a competitive-intelligence
          product that reads publicly available information about companies you ask it to watch. This policy
          explains what information we collect from you, how we use it, and what choices you have.
        </p>

        <h2>What we watch, and what we don&rsquo;t</h2>
        <p>
          The product itself only reads publicly available information — pricing pages, ad libraries, job
          boards, certificate-transparency logs, press, review sites, and similar public sources belonging to
          the companies you track. We do not scrape private data, and we do not access login-walled content
          beyond what a business has itself chosen to publish. If a page can&rsquo;t be reached publicly, the
          product says so rather than finding another way in.
        </p>

        <h2>Information we collect</h2>
        <p>When you use Fortress HQ, we collect information in a few ways:</p>
        <ul>
          <li><strong>Account information.</strong> Name, work email, and workspace details you provide when you
            sign up or are invited to a workspace.</li>
          <li><strong>Billing information.</strong> Handled by our payment processor; we do not store full card
            numbers ourselves.</li>
          <li><strong>Product usage.</strong> Basic usage data (pages visited in the app, features used) so we
            can keep the product working and fix what&rsquo;s broken.</li>
          <li><strong>Contact form submissions.</strong> If you write to us through the contact form, we collect
            the name, email, and message you provide.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To operate your account and the workspace(s) you belong to.</li>
          <li>To respond to messages sent through the contact form or to our support address — contact data is
            used only to respond to you, not for marketing you didn&rsquo;t sign up for.</li>
          <li>To bill for the plan you&rsquo;ve chosen.</li>
          <li>To maintain, secure, and improve the product.</li>
        </ul>
        <p>
          We do not sell your data, or your workspace&rsquo;s data, to third parties.
        </p>

        <h2>Workspace isolation</h2>
        <p>
          Each customer&rsquo;s workspace data — the competitors you track, the briefings generated for you, your
          standing orders and settings — is isolated per customer (org-scoped). It is not visible to, or mixed
          with, any other customer&rsquo;s workspace.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep account and workspace data for as long as your account is active. If you close your account,
          we delete or anonymize account data within a reasonable period, except where we&rsquo;re required to
          keep records for legal, tax, or billing reasons. Contact-form messages are kept only as long as needed
          to resolve the conversation they relate to.
        </p>

        <h2>Sharing</h2>
        <p>
          We share information only with service providers who help us run the product — for example, hosting
          and payment processing — under agreements that limit what they can do with it. We do not sell personal
          data, and we do not share workspace data across customers.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us to access, correct, export, or delete the personal information we hold about you.
          Depending on where you live, you may have additional rights under laws like the GDPR or CCPA. To
          exercise any of these, contact us using the details below.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or a request about your data, can go to{' '}
          <a href="mailto:hello@fortress-hq.example">hello@fortress-hq.example</a>.
        </p>
      </div>
    </section>
  );
}
