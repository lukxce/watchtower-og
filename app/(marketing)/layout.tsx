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
            <span className="wm">fortress<b>hq</b></span>
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
        <span className="mkt-watermark" aria-hidden="true">FORTRESS HQ</span>
        <div className="wrap">
          <div className="fbrand">
            <div className="mkt-logo">
              <Logo />
              <span className="wm">fortress<b>hq</b></span>
            </div>
            <p>Verifiable competitive intelligence. Every signal cited, every gap disclosed.</p>
          </div>
          <div className="fcol">
            <h5>Features</h5>
            <Link href="/features/overview">Overview</Link>
            <Link href="/features/battlecards">Battlecards</Link>
            <Link href="/features/campaign-intelligence">Campaign Intelligence</Link>
            <Link href="/features/insights">Insights</Link>
            <Link href="/features/data-sources">Data Sources</Link>
            <Link href="/features/displacement-outbound">Displacement &amp; Outbound</Link>
            <Link href="/features/reports">Reports</Link>
            <Link href="/features/briefings">Briefings</Link>
          </div>
          <div className="fcol">
            <h5>Teams</h5>
            <Link href="/teams/marketing">Marketing</Link>
            <Link href="/teams/product-marketing">Product Marketing (PMM)</Link>
            <Link href="/teams/sales">Sales</Link>
            <Link href="/teams/product">Product</Link>
            <Link href="/teams/executives">Executives</Link>
          </div>
          <div className="fcol">
            <h5>Intelligence Hubs</h5>
            <Link href="/hubs/competitive-intelligence">Competitive Intelligence</Link>
            <Link href="/hubs/sales-intelligence">Sales Intelligence</Link>
            <Link href="/hubs/gtm-engineering">GTM Engineering</Link>
            <Link href="/hubs/ai-search-visibility">AI Search Visibility</Link>
            <Link href="/hubs/spend-management">Spend Management</Link>
          </div>
          <div className="fcol">
            <h5>Compare &amp; Resources</h5>
            <Link href="/free-radar">Free competitor radar</Link>
            <Link href="/blog">Resources &amp; guides</Link>
            <Link href="/alternatives/klue">Klue Alternative</Link>
            <Link href="/alternatives/crayon">Crayon Alternative</Link>
            <Link href="/alternatives/kompyte">Kompyte Alternative</Link>
            <Link href="/compare/chatgpt">Fortress HQ vs ChatGPT</Link>
            <Link href="/alternatives">All alternatives →</Link>
            <Link href="/compare">All comparisons →</Link>
            <Link href="/companies">All companies →</Link>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/methodology">Methodology</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/email-preferences">Email preferences</Link>
          </div>
          <div className="fcol">
            <h5>Account</h5>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up">Start free</Link>
          </div>
        </div>
        <div className="wrap">
          <div className="mkt-footer-bottom">© {new Date().getFullYear()} Fortress HQ. Built to be verifiable.</div>
        </div>
      </footer>
    </div>
  );
}
