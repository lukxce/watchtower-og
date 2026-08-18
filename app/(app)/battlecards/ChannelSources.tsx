'use client';
// Lets a customer supply the pages we cannot derive — Glassdoor's employer id,
// Gartner's product URL, LinkedIn's company slug.
//
// Collapsed by default and headlined with a count, because for a healthy
// workspace the honest answer is "nothing to do here" and that should take up
// one line, not a screen. It opens straight to the unresolved ones: the point
// is to clear a list, not to browse a settings page.
import { useEffect, useState } from 'react';

interface ChannelSpec {
  channel: string;
  label: string;
  help: string;
  placeholder: string;
  findIt: string;
  autoDiscovered: boolean;
}
interface Row {
  id: number;
  name: string;
  slug: string;
  sources: Record<string, string | null>;
}

export default function ChannelSources() {
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelSpec[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/competitors/source')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j) return;
        setChannels(j.channels);
        setRows(j.competitors);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const missing = rows.reduce(
    (n, r) => n + channels.filter((c) => !r.sources[c.channel]).length,
    0,
  );
  const visible = showAll ? rows : rows.filter((r) => channels.some((c) => !r.sources[c.channel]));

  if (!loaded || rows.length === 0) return null;

  return (
    <div className="src-wrap">
      <button className="src-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className={`src-dot ${missing ? 'warn' : 'ok'}`} />
        {missing === 0
          ? 'Channel sources — all set'
          : `Channel sources — ${missing} unset across ${visible.length} competitor${visible.length === 1 ? '' : 's'}`}
        <span className="src-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="src-body">
          <p className="src-intro">
            Three channels are keyed by a page address we can’t work out from a domain. LinkedIn we
            look for in their site footer; when it isn’t there, or for Glassdoor and Gartner, paste
            the page here. Leave blank any the competitor genuinely isn’t on.
          </p>

          {visible.map((r) => (
            <div className="src-comp" key={r.id}>
              <div className="src-comp-name">{r.name}</div>
              {channels.map((c) => (
                <SourceField key={c.channel} row={r} spec={c} onSaved={(url) => {
                  setRows((prev) =>
                    prev.map((p) => (p.id === r.id ? { ...p, sources: { ...p.sources, [c.channel]: url } } : p)),
                  );
                }} />
              ))}
            </div>
          ))}

          {rows.length > visible.length && !showAll && (
            <button className="src-more" onClick={() => setShowAll(true)}>
              Show {rows.length - visible.length} fully configured
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SourceField({
  row,
  spec,
  onSaved,
}: {
  row: Row;
  spec: ChannelSpec;
  onSaved: (url: string | null) => void;
}) {
  const current = row.sources[spec.channel];
  const [value, setValue] = useState(current ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/competitors/source', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ competitorId: row.id, channel: spec.channel, url: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Could not save that.');
      onSaved(json.url);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="src-field">
      <div className="src-field-head">
        <span className={`src-dot sm ${current ? 'ok' : 'warn'}`} />
        <span className="src-field-label">{spec.label}</span>
        {spec.autoDiscovered && !current && <span className="src-tag">looked, not found</span>}
      </div>
      <div className="src-row">
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          placeholder={spec.placeholder}
          spellCheck={false}
        />
        <button onClick={save} disabled={busy || value === (current ?? '')}>
          {busy ? 'Saving…' : saved ? 'Saved' : 'Save'}
        </button>
      </div>
      {error ? <p className="src-err">{error}</p> : <p className="src-hint">{spec.findIt}</p>}
    </div>
  );
}
