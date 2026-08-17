import Link from 'next/link';
import Logo from './Logo';
import MobileNav from './MobileNav';
import './marketing.css';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mkt">
      <header className="mkt-nav">
        <div className="wrap">
          <Link href="/" className="mkt-logo">
            <Logo />
            <span className="wm">watchtower</span>
          </Link>
          <nav className="mkt-links">
            <Link href="/#platform" className="mkt-navlink">Product</Link>
            <Link href="/pricing" className="mkt-navlink">Pricing</Link>
            <Link href="/blog" className="mkt-navlink">Blog</Link>
          </nav>
          <div className="mkt-cta-row">
            <Link href="/sign-in" className="btn btn-ghost">Sign in</Link>
            <Link href="/sign-up" className="btn btn-primary">Start free</Link>
          </div>
          <MobileNav />
        </div>
      </header>
      {children}
      <footer className="mkt-footer">
        <span className="mkt-watermark" aria-hidden="true">WATCHTOWER</span>
        <div className="wrap">
          <div className="fbrand">
            <div className="mkt-logo">
              <Logo />
              <span className="wm">watchtower</span>
            </div>
            <p>Verifiable competitive intelligence. Every signal cited, every gap disclosed.</p>
          </div>
          <div className="fcol">
            <h5>Product</h5>
            <Link href="/#proof">How it works</Link>
            <Link href="/#platform">Battlecards</Link>
            <Link href="/demo">Live demo</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="fcol">
            <h5>Account</h5>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up">Start free</Link>
          </div>
        </div>
        <div className="wrap">
          <div className="mkt-footer-bottom">© {new Date().getFullYear()} Watchtower. Built to be verifiable.</div>
        </div>
      </footer>
    </div>
  );
}
