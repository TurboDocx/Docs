// Markdown twins of API reference pages: the generated MDX renders params, body and responses through
// theme components (<ParamsDetails>, <RequestSchema>, <StatusCodes>) whose data is JSON in a prop.
// The twin would otherwise carry that raw JSX; turn each block into plain markdown instead.
const BLOCK = /^<(ParamsDetails|RequestSchema|StatusCodes)\n([\s\S]*?)\n>(?:\s*\n\s*<\/\1>)?/gm;

const code = (v) => `\`${typeof v === 'string' ? v : JSON.stringify(v)}\``;

function typeOf(s = {}) {
  if (s.type === 'array') return `${typeOf(s.items)}[]`;
  return s.type || (s.properties ? 'object' : s.format || 'any');
}

function line(name, s = {}, required, desc = s.description) {
  const tags = [typeOf(s), required && 'required', s.nullable && 'nullable'].filter(Boolean).join(', ');
  const parts = [`\`${name}\` (${tags})${desc ? `: ${desc.replace(/\s*\n\s*/g, ' ').trim()}` : ''}`];
  if (s.enum) parts.push(`Allowed: ${s.enum.map(code).join(', ')}.`);
  if (s.default !== undefined) parts.push(`Default: ${code(s.default)}.`);
  if (parts.length > 1 && !parts[0].endsWith('.')) parts[0] += '.';
  return parts.join(' ');
}

function fields(schema = {}, depth = 0) {
  const obj = schema.type === 'array' ? schema.items || {} : schema;
  const req = new Set(obj.required || []);
  return Object.entries(obj.properties || {}).flatMap(([name, s]) => [
    `${'  '.repeat(depth)}- ${line(name, s, req.has(name))}`,
    ...fields(s, depth + 1),
  ]);
}

function params(parameters = []) {
  return ['path', 'query', 'header', 'cookie'].flatMap((where) => {
    const ps = parameters.filter((p) => p.in === where);
    if (!ps.length) return [];
    const title = `${where[0].toUpperCase()}${where.slice(1)} parameters`;
    return [`### ${title}`, ps.map((p) => `- ${line(p.name, p.schema, p.required, p.description)}`).join('\n')];
  });
}

function body(requestBody) {
  return Object.entries(requestBody?.content || {}).flatMap(([type, media]) => [
    `### Body (${type})`,
    [requestBody.description, fields(media.schema).join('\n')].filter(Boolean).join('\n\n'),
  ]);
}

function responses(rs = {}) {
  return [
    '### Responses',
    ...Object.entries(rs).flatMap(([status, r]) => {
      const media = Object.values(r.content || {})[0] || {};
      const example = media.example ?? Object.values(media.examples || {})[0]?.value;
      return [
        `#### ${status}`,
        ...(r.description ? [r.description.trim()] : []),
        ...(example !== undefined ? ['```json\n' + JSON.stringify(example, null, 2) + '\n```'] : []),
      ];
    }),
  ];
}

function props(text) {
  const out = {};
  for (const m of text.matchAll(/^\s+(\w+)=\{(.*)\}$/gm)) {
    try {
      out[m[1]] = JSON.parse(m[2]);
    } catch {
      // not JSON (e.g. a string literal title); not needed
    }
  }
  return out;
}

export function apiJsxToMarkdown(md) {
  return md.replace(BLOCK, (_, tag, inner) => {
    const p = props(inner);
    const parts =
      tag === 'ParamsDetails' ? params(p.parameters) : tag === 'RequestSchema' ? body(p.body) : responses(p.responses);
    return parts.join('\n\n');
  });
}
