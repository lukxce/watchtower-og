import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import NavLinks from '../NavLinks';
import { clerkConfigured } from '@/lib/tenant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <aside className="side">
        <a className="logo" href="/feed">
          watch<b>tower</b>
        </a>
        {clerkConfigured ? (
          <div className="workspace-switch">
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/feed"
              afterCreateOrganizationUrl="/feed"
              hidePersonal
              appearance={{ elements: { organizationSwitcherTrigger: 'ws-trigger' } }}
            />
          </div>
        ) : (
          <div className="workspace-switch dev">
            <span className="ws-dot" />
            dev-workspace
          </div>
        )}
        <NavLinks />
        {clerkConfigured && (
          <div className="side-user">
            <UserButton />
          </div>
        )}
      </aside>
      {children}
    </div>
  );
}
