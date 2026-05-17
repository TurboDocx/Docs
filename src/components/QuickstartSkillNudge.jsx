import React, { useState } from 'react';

/**
 * Top-of-page nudge encouraging readers to use the TurboDocx Quickstart agent
 * skill to scaffold the integration instead of hand-writing boilerplate.
 *
 * Renders a card with:
 *   - Headline + sub-copy
 *   - Live skill count badge (skills.sh)
 *   - A copy-pasteable `npx skills add ...` command (with a copy button)
 *   - The exact slash-command to run inside the agent
 *   - Link to the GitHub repo
 *
 * Props:
 *   command  — slash command displayed inside the agent (e.g. "/turbodocx-sdk turbowebhooks")
 *   product  — short product name used in the body copy ("TurboWebhooks", "TurboSign", …)
 */
export default function QuickstartSkillNudge({
  command = '/turbodocx-sdk',
  product = 'TurboDocx',
}) {
  const INSTALL_CMD = 'npx skills add TurboDocx/quickstart';
  const REPO_URL = 'https://github.com/TurboDocx/quickstart';
  const BADGE_URL = 'https://skills.sh/b/TurboDocx/quickstart';

  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API can fail on insecure contexts — fall back to selection
      const ta = document.createElement('textarea');
      ta.value = INSTALL_CMD;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
      document.body.removeChild(ta);
    }
  };

  // ── styles ────────────────────────────────────────────────────────────
  const card = {
    position: 'relative',
    margin: '0 0 2rem 0',
    padding: '1.25rem 1.5rem 1.1rem',
    borderRadius: '12px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    background:
      'linear-gradient(135deg, rgba(20,163,139,0.10) 0%, rgba(20,163,139,0.02) 55%, rgba(20,163,139,0) 100%)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  };

  const accentBar = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(180deg, #14A38B 0%, #0EBE7F 100%)',
  };

  const header = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
  };

  const titleWrap = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  };

  const iconBox = {
    width: '28px',
    height: '28px',
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #14A38B 0%, #0EBE7F 100%)',
    color: '#fff',
    boxShadow: '0 1px 4px rgba(20, 163, 139, 0.45)',
  };

  const titleText = {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--ifm-heading-color, inherit)',
    letterSpacing: '-0.01em',
  };

  const badgeImg = {
    height: '20px',
    verticalAlign: 'middle',
  };

  const subcopy = {
    margin: '0 0 0.9rem 0',
    fontSize: '0.93rem',
    lineHeight: 1.5,
    color: 'var(--ifm-color-emphasis-700)',
  };

  // Terminal-styled box: dark in both light and dark mode (classic terminal look)
  const codeBlock = {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    background: '#1b1b1d',
    border: '1px solid #2d2d30',
    borderRadius: '8px',
    fontFamily: 'var(--ifm-font-family-monospace, ui-monospace, SFMono-Regular, monospace)',
    fontSize: '0.88rem',
    lineHeight: 1.4,
    margin: '0 0 0.85rem 0',
  };

  const codeText = {
    flex: '1 1 auto',
    padding: '0.7rem 0.9rem',
    color: '#f0f0f0',
    overflow: 'auto',
    whiteSpace: 'nowrap',
  };

  const promptDollar = {
    color: '#0EBE7F',
    fontWeight: 700,
    marginRight: '0.55rem',
    userSelect: 'none',
  };

  const copyBtn = {
    flex: '0 0 auto',
    border: 'none',
    borderLeft: '1px solid #2d2d30',
    background: 'transparent',
    color: copied ? '#0EBE7F' : '#9ca3af',
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '0 1rem',
    cursor: 'pointer',
    transition: 'color 120ms ease',
  };

  const footer = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    flexWrap: 'wrap',
    fontSize: '0.88rem',
    color: 'var(--ifm-color-emphasis-700)',
  };

  const slashLine = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    flexWrap: 'wrap',
  };

  const slashCmd = {
    fontFamily: 'var(--ifm-font-family-monospace, ui-monospace, SFMono-Regular, monospace)',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'var(--ifm-code-background, rgba(20, 163, 139, 0.10))',
    border: '1px solid var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-color-content)',
    whiteSpace: 'nowrap',
  };

  const githubLink = {
    color: 'var(--ifm-color-primary, #14A38B)',
    textDecoration: 'none',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    whiteSpace: 'nowrap',
  };

  // ── icons ─────────────────────────────────────────────────────────────
  const boltIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const ghIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.97 10.97 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/>
    </svg>
  );

  return (
    <div style={card}>
      <div style={accentBar} aria-hidden="true" />

      <div style={header}>
        <div style={titleWrap}>
          <div style={iconBox}>{boltIcon}</div>
          <h3 style={titleText}>Let an agent scaffold this for you</h3>
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View skill stats and source on GitHub"
        >
          <img src={BADGE_URL} alt="Skills count" style={badgeImg} />
        </a>
      </div>

      <p style={subcopy}>
        Install the <strong>TurboDocx Quickstart Skill</strong> and let Claude
        Code, Cursor, Copilot, Codex, or any agent that speaks the{' '}
        <a href="https://agentskills.io" target="_blank" rel="noopener noreferrer">
          Agent Skills
        </a>{' '}
        standard install the SDK, wire routes into your app, and write a working{' '}
        {product} integration end-to-end.
      </p>

      <div style={codeBlock}>
        <span style={codeText}>
          <span style={promptDollar}>$</span>{INSTALL_CMD}
        </span>
        <button
          type="button"
          onClick={copyInstall}
          style={copyBtn}
          onMouseOver={(e) => { if (!copied) e.currentTarget.style.color = '#0EBE7F'; }}
          onMouseOut={(e) => { if (!copied) e.currentTarget.style.color = '#9ca3af'; }}
          aria-label="Copy install command"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div style={footer}>
        <div style={slashLine}>
          <span>Then run</span>
          <code style={slashCmd}>{command}</code>
          <span>in your agent.</span>
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={githubLink}
        >
          {ghIcon}
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}
