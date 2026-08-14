// Bare layout for the design-test betas: NO app chrome (no topbar, no
// channel rail, no gradient shell). Each beta page builds its own complete
// interface — nav, rail, profile — faithful to its reference, so the
// design is judged whole, not as a reskin inside our frame.
import '../globals.css';

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
