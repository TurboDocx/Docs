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

test('the endpoint line becomes the method, full URL and a curl request', () => {
  const md = '<MethodEndpoint\n  method={"post"}\n  path={"/api/webhooks/{id}"}\n  context={"endpoint"}\n>\n  \n</MethodEndpoint>';
  const out = apiJsxToMarkdown(md);
  assert.doesNotMatch(out, /<MethodEndpoint/);
  assert.match(out, /`POST https:\/\/api\.turbodocx\.com\/api\/webhooks\/\{id\}`/);
  assert.match(out, /```bash\ncurl -X POST "https:\/\/api\.turbodocx\.com\/api\/webhooks\/\{id\}" \\\n  -H "Authorization: Bearer \$TURBODOCX_API_KEY" \\\n  -H "x-rapiddocx-org-id: \$TURBODOCX_ORG_ID"/);
});

test('shallow blocks (description-only responses) still convert', () => {
  const md = '<StatusCodes\n  responses={{"204":{"description":"Deleted."}}}\n>\n  \n</StatusCodes>';
  assert.match(apiJsxToMarkdown(md), /#### 204\n\nDeleted\./);
});

test('an empty block (no params) is removed', () => {
  assert.equal(apiJsxToMarkdown('A\n\n<ParamsDetails>\n\n</ParamsDetails>\n\nB'), 'A\n\n\n\nB');
});

test('pages without API components are unchanged', () => {
  const md = '# Guide\n\n<Tabs>\n<TabItem value="a">x</TabItem>\n</Tabs>\n';
  assert.equal(apiJsxToMarkdown(md), md);
});
