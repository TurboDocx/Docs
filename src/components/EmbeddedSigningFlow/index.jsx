import React from 'react';
import styles from './styles.module.css';

/**
 * Diagram of the embedded signing flow: the signing iframe, your app (browser),
 * your server (holds the API key) and TurboDocx, with steps 1-4 on the arrows.
 * Colors come from Docusaurus CSS variables, so it follows light and dark mode.
 */

const NODES = [
  { x: 12, title: 'Signing page', sub: 'verifies, then signs' },
  { x: 262, title: 'Your app', sub: 'in the browser' },
  { x: 512, title: 'Your server', sub: 'holds the API key' },
  { x: 762, title: 'TurboDocx', sub: 'TurboSign API' },
];
const W = 186;
const TOP = 120;
const H = 84;

function Step({ x, y, n }) {
  return (
    <g>
      <circle className={styles.stepDot} cx={x} cy={y} r="11" />
      <text className={styles.stepNum} x={x} y={y + 4} textAnchor="middle">{n}</text>
    </g>
  );
}

function Arrow({ from, to, y, label, step, edge }) {
  const cx = (i) => NODES[i].x + W / 2;
  const x1 = cx(from);
  const x2 = cx(to);
  const mid = (x1 + x2) / 2;
  const y0 = edge === 'top' ? TOP : TOP + H;
  const labelWidth = label.length * 7.6;
  return (
    <g>
      <line className={styles.stub} x1={x1} y1={y0} x2={x1} y2={y} />
      <polyline
        className={styles.flow}
        points={`${x1},${y} ${x2},${y} ${x2},${y0 + (edge === 'top' ? -2 : 2)}`}
        markerEnd="url(#esf-arrow)"
      />
      <rect className={styles.labelBg} x={mid - labelWidth / 2 - (step ? 22 : 6)} y={y - 11} width={labelWidth + (step ? 34 : 12)} height="22" rx="11" />
      {step ? <Step x={mid - labelWidth / 2 - 8} y={y} n={step} /> : null}
      <text className={styles.label} x={mid + (step ? 8 : 0)} y={y + 4} textAnchor="middle">{label}</text>
    </g>
  );
}

export default function EmbeddedSigningFlow() {
  const right = (i) => NODES[i].x + W;
  const leftEdge = (i) => NODES[i].x;
  const yTop = TOP + 26;
  const yBottom = TOP + H - 18;
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox="0 40 960 290"
        role="img"
        aria-labelledby="esf-title esf-desc"
      >
        <title id="esf-title">How embedded signing works</title>
        <desc id="esf-desc">
          Step 1: your app asks your server for a signing session, and your server, which holds the API key,
          asks TurboDocx to create the document and a signing URL. Step 2: the embed URL comes back through
          your server to your app, which loads it in an iframe. Step 3: the TurboSign signing page in the
          iframe verifies the signer and collects the signature. Step 4: the signing page posts a
          turbosign:completed message back to your app.
        </desc>
        <defs>
          <marker id="esf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path className={styles.arrowHead} d="M0 0 L10 5 L0 10 z" />
          </marker>
        </defs>

        {NODES.map((n, i) => (
          <g key={n.title}>
            <rect className={`${styles.node} ${i === 3 ? styles.nodeBrand : ''}`} x={n.x} y={TOP} width={W} height={H} rx="12" />
            <text className={styles.nodeTitle} x={n.x + W / 2} y={TOP + 38} textAnchor="middle">{n.title}</text>
            <text className={styles.nodeSub} x={n.x + W / 2} y={TOP + 60} textAnchor="middle">{n.sub}</text>
          </g>
        ))}

        {/* Step 1: app -> server -> TurboDocx (above the boxes) */}
        <Arrow from={1} to={2} y={TOP - 40} edge="top" label="POST /api/signing-session" step="1" />
        <Arrow from={2} to={3} y={TOP - 78} edge="top" label="create document + URL" />

        {/* Step 2: embedUrl back to the app (below), then into the iframe (above) */}
        <Arrow from={3} to={2} y={TOP + H + 40} edge="bottom" label="embedUrl" />
        <Arrow from={2} to={1} y={TOP + H + 40} edge="bottom" label="embedUrl" step="2" />
        <Arrow from={1} to={0} y={TOP - 40} edge="top" label="iframe src" />

        {/* Step 3: the signing page verifies the signer and collects the signature */}
        <Step x={NODES[0].x + 20} y={TOP + 20} n="3" />

        {/* Step 4: completion message back to the app */}
        <Arrow from={0} to={1} y={TOP + H + 78} edge="bottom" label="turbosign:completed" step="4" />
      </svg>
      <figcaption className={styles.caption}>
        Your API key stays on your server. The browser only ever sees a per-signer signing URL.
      </figcaption>
    </figure>
  );
}
