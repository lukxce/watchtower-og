import { Suspense } from 'react';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import NavLinks from '../NavLinks';
import Logo from '../(marketing)/Logo';
import ChannelRail from '../ChannelRail';
import { clerkConfigured } from '@/lib/tenant';
import { getViewAsOrg } from '@/lib/adminAuth';
import { isDemo } from '@/lib/demo';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const viewingAs = await getViewAsOrg();
  const demo = await isDemo();
  return (
    <div className="app">
      {demo && (
        <div className="demo-banner">
          <span><b>Demo</b> · real signals from a live workspace tracking 5 real competitors. Read only.</span>
          <a className="demo-cta" href="/sign-up">Start free</a>
          <a className="demo-exit" href="/api/demo/exit">Exit</a>
        </div>
      )}
      {viewingAs && !demo && (
        <div className="admin-banner">
          Viewing as workspace <b className="mono">{viewingAs}</b> — this is exactly what that client sees.
          <a href="/api/admin/view-as?clear=1">Exit view-as</a>
        </div>
      )}
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href="/overview">
            <Logo />
            watch<b>tower</b>
          </a>
          <NavLinks demo={demo} />
          <div className="top-right">
            {demo ? (
              <span className="ws-chip">
                <span className="ws-dot" />
                demo workspace
              </span>
            ) : clerkConfigured ? (
              <>
                <OrganizationSwitcher afterSelectOrganizationUrl="/overview" afterCreateOrganizationUrl="/onboarding" hidePersonal />
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
      <div className="app-body">
        <Suspense fallback={<aside className="side-rail" />}>
          <ChannelRail />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
