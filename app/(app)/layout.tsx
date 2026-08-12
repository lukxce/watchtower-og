import NavLinks from '../NavLinks';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <aside className="side">
        <a className="logo" href="/feed">
          watch<b>tower</b>
        </a>
        <NavLinks />
      </aside>
      {children}
    </div>
  );
}
