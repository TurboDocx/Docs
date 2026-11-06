// Run: node --test scripts/api-twin.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { apiJsxToMarkdown } from './api-twin.mjs';

const block = (tag, prop, value) => `<${tag}\n  ${prop}={${JSON.stringify(value)}}\n>\n  \n</${tag}>`;

test('params, body and responses become markdown', () => {
  const md = [
    '  Request',
    block('RequestSchema', 'body', {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string', description: 'Webhook name.' },
              recipients: {
                type: 'array',
                items: { type: 'object', properties: { email: { type: 'string' } } },
              },
            },
          },
        },
      },
    }),
    block('ParamsDetails', 'parameters', [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'showTags', in: 'query', schema: { type: 'boolean', enum: [true, false], default: false } },
    ]),
    block('StatusCodes', 'responses', {
      200: { description: 'OK.', content: { 'application/json': { example: { data: { id: 'x' } } } } },
      401: { description: 'Missing key. The response has no body.' },
    }),
  ].join('\n\n');

  const out = apiJsxToMarkdown(md);
  assert.doesNotMatch(out, /<(RequestSchema|ParamsDetails|StatusCodes)\b/);
  assert.match(out, /### Body \(application\/json\)/);
  assert.match(out, /- `name` \(string, required\): Webhook name\./);
  assert.match(out, /  - `email` \(string\)/); // nested array-of-object field, indented
  assert.match(out, /### Path parameters\n\n- `id` \(string, required\)/);
  assert.match(out, /`showTags` \(boolean\)\. Allowed: `true`, `false`\. Default: `false`/);
  assert.match(out, /#### 200\n\nOK\.\n\n```json\n\{\n  "data"/);
  assert.match(out, /#### 401\n\nMissing key\./);
});

test('pages without API components are unchanged', () => {
  const md = '# Guide\n\n<Tabs>\n<TabItem value="a">x</TabItem>\n</Tabs>\n';
  assert.equal(apiJsxToMarkdown(md), md);
});
