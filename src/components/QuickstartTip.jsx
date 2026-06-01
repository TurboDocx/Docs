import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './QuickstartTip.module.css';

// One-source-of-truth plug for the TurboDocx Quickstart Agent Skill.
// Rendered at the top of every SDK page. Edit here to update everywhere.

const COMMAND = 'npx skills add TurboDocx/quickstart';

function BoltIcon() {
  return (
    <svg className={styles.bolt} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
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

export default function QuickstartTip() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(COMMAND).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.pitch}>
        <span className={styles.badge}>
          <BoltIcon /> Agent Skill
        </span>
        <h4 className={styles.heading}>Install with one prompt</h4>
        <p className={styles.sub}>
          Skip the boilerplate. Point Claude Code, Copilot, Cursor, Codex, or
          Gemini at the{' '}
          <Link to="/docs/SDKs/agent-skills">TurboDocx Agent Skill</Link> — it
          installs the SDK, wires up your env vars, and writes working
          integration code that matches your stack.
        </p>
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
          <code className={styles.cmd}>
            <span className={styles.prompt}>$</span>
            {COMMAND}
          </code>
          <button
            type="button"
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            aria-label="Copy install command"
          >
            <CopyIcon copied={copied} />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
