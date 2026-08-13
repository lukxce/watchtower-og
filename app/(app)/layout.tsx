import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import NavLinks from '../NavLinks';
import IconRail from '../IconRail';
import { clerkConfigured } from '@/lib/tenant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href="/feed">
            <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="2" y1="21" x2="9" y2="6" stroke="#cf7a1f" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="21" x2="15" y2="3" stroke="#cf7a1f" strokeWidth="2" strokeLinecap="round" />
              <line x1="14" y1="21" x2="21" y2="9" stroke="#cf7a1f" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="21" x2="24" y2="13" stroke="#cf7a1f" strokeWidth="2" strokeLinecap="round" />
            </svg>
            watch<b>tower</b>
          </a>
          <NavLinks />
          <div className="top-right">
            {clerkConfigured ? (
              <>
                <OrganizationSwitcher afterSelectOrganizationUrl="/feed" afterCreateOrganizationUrl="/feed" hidePersonal />
                <UserButton />
              </>
            ) : (
              <span className="ws-chip">
                <span className="ws-dot" />
                dev-workspace
              </span>
            )}
          </div>
        </div>
      </header>
      <IconRail />
      {children}
    </div>
  );
}
