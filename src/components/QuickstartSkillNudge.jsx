import React, { useState } from 'react';
import styles from './QuickstartSkillNudge.module.css';

/**
 * Top-of-page nudge encouraging readers to use the TurboDocx Quickstart agent
 * skill to scaffold the integration instead of hand-writing boilerplate.
 *
 * Renders a developer-styled terminal card with:
 *   - Headline + sub-copy
 *   - Live skill count badge (skills.sh) + a link to the GitHub repo
 *   - A copy-pasteable `npx skills add ...` install command (with a copy button)
 *   - The exact slash-command to run inside the agent
 *
 * Props:
 *   command  — slash command displayed inside the agent (e.g. "/turbodocx-sdk turbowebhooks")
 *   product  — short product name used in the body copy ("TurboWebhooks", "TurboSign", …)
 */

const INSTALL_CMD = 'npx skills add TurboDocx/quickstart';
const REPO_URL = 'https://github.com/TurboDocx/quickstart';
const BADGE_URL = 'https://skills.sh/b/TurboDocx/quickstart';

function BoltIcon() {
  return (
    <svg className={styles.bolt} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className={styles.ghIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.97 10.97 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function CopyIcon({ copied }) {
  return copied ? (
    <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg className={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export default function QuickstartSkillNudge({
  command = '/turbodocx-sdk',
  product = 'TurboDocx',
}) {
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
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.pitch}>
        <span className={styles.badge}>
          <BoltIcon /> Agent Skill
        </span>
        <h3 className={styles.heading}>Let an agent scaffold this for you</h3>
        <p className={styles.sub}>
          Install the <strong>TurboDocx Quickstart Skill</strong> and let Claude
          Code, Cursor, Copilot, Codex, or any agent that speaks the{' '}
          <a href="https://agentskills.io" target="_blank" rel="noopener noreferrer">
            Agent Skills
          </a>{' '}
          standard install the SDK, wire it into your app, and write a working{' '}
          {product} integration end-to-end.
        </p>
        <div className={styles.links}>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="View skill stats on GitHub">
            <img src={BADGE_URL} alt="Skill count" className={styles.badgeImg} />
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={styles.github}>
            <GitHubIcon />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      <div className={styles.terminal}>
        <div className={styles.bar}>
          <span className={styles.dots}>
            <span className={`${styles.dot} ${styles.red}`} />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </span>
          <span className={styles.barTitle}>bash — turbodocx</span>
        </div>
        <div className={styles.body}>
          <div className={styles.line}>
            <code className={styles.cmd}>
              <span className={styles.prompt}>$</span>
              {INSTALL_CMD}
            </code>
            <button
              type="button"
              className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
              onClick={copyInstall}
              aria-label="Copy install command"
            >
              <CopyIcon copied={copied} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <span className={styles.comment}># then, inside your agent:</span>
          <code className={styles.cmd}>
            <span className={styles.agentPrompt}>›</span>
            {command}
          </code>
        </div>
      </div>
    </div>
  );
}
