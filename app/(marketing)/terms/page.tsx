/*
  DRAFT — this is a starting point, not finished legal work. It has not been
  reviewed by a lawyer. Fortress HQ should get real legal review on these
  terms before they are relied on at launch. Nothing on this page is legal
  advice.
*/
import '../company.css';

export const metadata = {
  title: 'Terms of Service — Fortress HQ',
  description: 'The terms that govern use of Fortress HQ.',
};

export default function Terms() {
  return (
    <section className="cox-page">
      <div className="wrap cox-legal">
        <p className="cox-note">
          Draft terms — this page has not yet had a legal review, and nothing on it is legal advice. Treat it as
          a plain-language starting point until it has been checked by a lawyer.
        </p>

        <h1>Terms of Service</h1>
        <p className="cox-updated">Last updated 18 August 2026</p>

        <p>
          These terms govern your use of Fortress HQ (the &ldquo;Service&rdquo;). By creating an account or using
          the Service, you agree to them. If you&rsquo;re using the Service on behalf of an organization, you&rsquo;re
          agreeing on its behalf as well.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service to collect or store anything other than publicly available information.</li>
          <li>Attempt to bypass, disable, or interfere with the Service&rsquo;s security or rate limits.</li>
          <li>Resell, sublicense, or provide access to the Service to anyone outside your own organization
            without our agreement.</li>
          <li>Use the Service for anything unlawful, or to harass, defame, or infringe the rights of others.</li>
          <li>Reverse-engineer the Service beyond what applicable law expressly permits.</li>
        </ul>

        <h2>Account &amp; billing</h2>
        <p>
          Fortress HQ is self-serve: plans and pricing are published on our{' '}
          <a href="/pricing">pricing page</a> and you can start a workspace directly, without a demo call. You&rsquo;re
          responsible for keeping your account credentials secure and for activity that happens under your
          account. Subscriptions renew automatically for the billing period you choose until you cancel; you can
          cancel at any time and you&rsquo;ll retain access through the end of the period you&rsquo;ve paid for. We
          may change pricing going forward, and will give notice before it applies to your account.
        </p>

        <h2>Service availability</h2>
        <p>
          We work to keep Fortress HQ available and accurate, but we don&rsquo;t promise a specific uptime figure
          or service-level agreement beyond a best-effort standard. Scouts depend on third-party public sources
          that can change, block access, or go down without notice, and the Service will disclose gaps rather
          than mask them. We may perform maintenance, and features may change as the product evolves.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The Service is provided &ldquo;as is.&rdquo; To the maximum extent permitted by law, Fortress HQ is not
          liable for indirect, incidental, or consequential damages arising from your use of the Service, and
          our total liability for any claim will not exceed the amount you paid us in the twelve months before
          the claim arose. Nothing here limits liability where the law doesn&rsquo;t allow it to be limited.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms as the product and the company evolve. If we make a material change,
          we&rsquo;ll make a reasonable effort to notify account holders before it takes effect. Continuing to use
          the Service after a change takes effect means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can go to{' '}
          <a href="mailto:hello@fortress-hq.example">hello@fortress-hq.example</a>.
        </p>
      </div>
    </section>
  );
}
