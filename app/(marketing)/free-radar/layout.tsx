import '../compare-resources.css';

export const metadata = {
  title: 'Free radar — Fortress HQ',
  description:
    "Point it at any domain. It'll find their sitemap outline and any subdomains registered on the certificate log in the last 90 days — a fraction of what Fortress HQ watches continuously.",
};

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return <div className="cpx">{children}</div>;
}
