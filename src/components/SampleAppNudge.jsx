import React from 'react';
import styles from './QuickstartSkillNudge.module.css';
import { GitHubIcon } from './QuickstartSkillNudge';

/**
 * GitHub variant of the QuickstartSkillNudge card: points readers at the runnable
 * embedded signing sample app and says which of its tabs matches the current page.
 * Reuses the QuickstartSkillNudge styles so both callouts look the same.
 *
 * Props:
 *   path  the sample app tab that matches this page (e.g. "Single signer")
 */

const REPO_URL = 'https://github.com/TurboDocx/SDK/tree/main/examples/embedded-web-app';

const STEPS = [
  { cmd: 'git clone https://github.com/TurboDocx/SDK' },
  { cmd: 'cd SDK/examples/embedded-web-app' },
  { cmd: 'cp .env.example .env', note: '# set an Administrator or Contributor API key, your org ID and a sender email' },
  { cmd: 'npm install' },
  { cmd: 'npm run server', note: '# terminal 1: the key-holding backend' },
  { cmd: 'npm run dev', note: '# terminal 2: then open http://localhost:5173' },
];

export default function SampleAppNudge({ path = 'Widget' }) {
  return (
    <div className={`${styles.wrap} ${styles.stacked}`}>
      <div className={styles.pitch}>
        <span className={styles.badge}>
          <GitHubIcon /> Example on GitHub
        </span>
        <h3 className={styles.heading}>Run this flow end to end</h3>
        <p className={styles.sub}>
          The <strong>embedded signing sample app</strong> shows this page's flow on its{' '}
          <strong>{path}</strong> tab. Add <code>http://localhost:5173</code> under{' '}
          <strong>Allowed embedding domains</strong> (development only). The API key stays on
          the app's small server and never reaches the browser.
        </p>
        <div className={styles.links}>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={styles.github}>
            <GitHubIcon />
            <span>View the sample app on GitHub</span>
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
          <span className={styles.barTitle}>bash: embedded-web-app</span>
        </div>
        <div className={styles.body}>
          {STEPS.map((s) => (
            <React.Fragment key={s.cmd}>
              {s.note ? <span className={styles.comment}>{s.note}</span> : null}
              <code className={styles.cmd} style={{ display: 'block' }}>
                <span className={styles.prompt}>$</span>
                {s.cmd}
              </code>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
